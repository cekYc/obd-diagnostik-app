import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import OBDCore, { OBD_COMMANDS } from '../services/OBDCore';
import { getDTCDescription } from '../data/dtcDatabase';
import type {
  DeviceType,
  ConnectionStatus,
  OBDData,
  DTC,
  SelectedVehicle,
  OBDContextType,
} from '../types/obd.types';

const OBDContext = createContext<OBDContextType | undefined>(undefined);

const BACKEND_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL;

export const OBDProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deviceType, setDeviceTypeState] = useState<DeviceType>('bluetooth');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [obdData, setObdData] = useState<OBDData>({
    rpm: 0,
    speed: 0,
    engineLoad: 0,
    coolantTemp: 0,
    vin: '',
  });
  const [dtcCodes, setDtcCodes] = useState<DTC[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<SelectedVehicle | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async (): Promise<void> => {
    try {
      const savedDeviceType = await AsyncStorage.getItem('device_type');
      if (savedDeviceType) {
        setDeviceTypeState(savedDeviceType as DeviceType);
      }
      
      const savedVehicle = await AsyncStorage.getItem('selected_vehicle');
      if (savedVehicle) {
        setSelectedVehicle(JSON.parse(savedVehicle));
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const setDeviceType = async (type: DeviceType): Promise<void> => {
    setDeviceTypeState(type);
    try {
      await AsyncStorage.setItem('device_type', type);
    } catch (error) {
      console.log('Error saving device type:', error);
    }
  };

  const connectDevice = async (): Promise<void> => {
    setConnectionStatus('connecting');
    
    if (deviceType === 'bluetooth') {
      try {
        // Scan for OBD devices
        const devices = await OBDCore.scanDevices();
        
        if (devices.length === 0) {
          setConnectionStatus('disconnected');
          console.log('No OBD-II devices found. Note: Bluetooth Classic requires custom dev client, not available in Expo Go');
          return;
        }
        
        // Connect to first available device
        const connected = await OBDCore.connect(devices[0]);
        
        if (connected) {
          setConnectionStatus('connected');
          console.log('Connected to OBD-II device');
          
          // Read VIN
          const vin = await OBDCore.readVIN();
          setObdData(prev => ({ ...prev, vin }));
          
          // Start reading data
          startDataReading();
        } else {
          setConnectionStatus('error');
          console.log('Failed to connect to OBD-II device');
        }
      } catch (error) {
        setConnectionStatus('error');
        console.error('Connection error:', error);
      }
    } else {
      // WiFi connection would be implemented here
      setConnectionStatus('disconnected');
      console.log('WiFi connection not yet implemented. Please select Bluetooth.');
    }
  };

  const startDataReading = (): void => {
    // Read OBD data every 1 second
    const interval = setInterval(async () => {
      if (OBDCore.isConnected()) {
        await readOBDData();
      } else {
        clearInterval(interval);
      }
    }, 1000);
  };

  const disconnectDevice = async (): Promise<void> => {
    await OBDCore.disconnect();
    setConnectionStatus('disconnected');
    setObdData({
      rpm: 0,
      speed: 0,
      engineLoad: 0,
      coolantTemp: 0,
      vin: '',
    });
  };

  const readOBDData = async (): Promise<void> => {
    if (connectionStatus !== 'connected') {
      return;
    }
    
    try {
      const rpm = await OBDCore.readPID(OBD_COMMANDS.RPM);
      const speed = await OBDCore.readPID(OBD_COMMANDS.SPEED);
      const engineLoad = await OBDCore.readPID(OBD_COMMANDS.ENGINE_LOAD);
      const coolantTemp = await OBDCore.readPID(OBD_COMMANDS.COOLANT_TEMP);
      
      setObdData(prev => ({
        ...prev,
        rpm: typeof rpm === 'number' ? Math.round(rpm) : 0,
        speed: typeof speed === 'number' ? Math.round(speed) : 0,
        engineLoad: typeof engineLoad === 'number' ? Math.round(engineLoad) : 0,
        coolantTemp: typeof coolantTemp === 'number' ? Math.round(coolantTemp) : 0,
      }));
    } catch (error) {
      console.error('Error reading OBD data:', error);
    }
  };

  const readDTC = async (): Promise<void> => {
    if (connectionStatus !== 'connected') {
      console.log('Device not connected');
      return;
    }
    
    try {
      const dtcs = await OBDCore.readDTC();
      
      // Enrich with Turkish descriptions
      const enrichedDTCs = dtcs.map(dtc => {
        const info = getDTCDescription(dtc.code);
        return {
          code: dtc.code,
          description: info?.turkishDescription || dtc.description,
        };
      });
      
      setDtcCodes(enrichedDTCs);
    } catch (error) {
      console.error('Error reading DTC:', error);
    }
  };

  const clearDTC = async (): Promise<void> => {
    if (connectionStatus !== 'connected') {
      console.log('Device not connected');
      return;
    }
    
    try {
      const success = await OBDCore.clearDTC();
      if (success) {
        setDtcCodes([]);
      }
    } catch (error) {
      console.error('Error clearing DTC:', error);
    }
  };

  return (
    <OBDContext.Provider
      value={{
        deviceType,
        setDeviceType,
        connectionStatus,
        obdData,
        dtcCodes,
        selectedVehicle,
        setSelectedVehicle,
        connectDevice,
        disconnectDevice,
        readOBDData,
        readDTC,
        clearDTC,
      }}
    >
      {children}
    </OBDContext.Provider>
  );
};

export const useOBD = (): OBDContextType => {
  const context = useContext(OBDContext);
  if (!context) {
    throw new Error('useOBD must be used within OBDProvider');
  }
  return context;
};
