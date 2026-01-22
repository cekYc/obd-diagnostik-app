import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type DeviceType = 'bluetooth' | 'wifi';
type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface OBDData {
  rpm: number;
  speed: number;
  engineLoad: number;
  coolantTemp: number;
  vin: string;
}

interface DTC {
  code: string;
  description: string;
}

interface OBDContextType {
  deviceType: DeviceType;
  setDeviceType: (type: DeviceType) => void;
  connectionStatus: ConnectionStatus;
  obdData: OBDData;
  dtcCodes: DTC[];
  selectedVehicle: {
    brand: string;
    model: string;
    year: string;
    engine: string;
  } | null;
  setSelectedVehicle: (vehicle: any) => void;
  connectDevice: () => Promise<void>;
  disconnectDevice: () => void;
  readOBDData: () => Promise<void>;
  readDTC: () => Promise<void>;
  clearDTC: () => Promise<void>;
}

const OBDContext = createContext<OBDContextType | undefined>(undefined);

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
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedDeviceType = await AsyncStorage.getItem('device_type');
      if (savedDeviceType) {
        setDeviceTypeState(savedDeviceType as DeviceType);
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const setDeviceType = async (type: DeviceType) => {
    setDeviceTypeState(type);
    try {
      await AsyncStorage.setItem('device_type', type);
    } catch (error) {
      console.log('Error saving device type:', error);
    }
  };

  const connectDevice = async () => {
    setConnectionStatus('connecting');
    try {
      // Real OBD-II connection logic will be implemented here
      // For now, simulate connection attempt
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // This will be replaced with actual Bluetooth/WiFi connection
      // using react-native-bluetooth-classic
      
      setConnectionStatus('disconnected');
      console.log('No OBD device found. Please connect a real OBD-II adapter.');
    } catch (error) {
      setConnectionStatus('error');
      console.error('Connection error:', error);
    }
  };

  const disconnectDevice = () => {
    setConnectionStatus('disconnected');
    setObdData({
      rpm: 0,
      speed: 0,
      engineLoad: 0,
      coolantTemp: 0,
      vin: '',
    });
  };

  const readOBDData = async () => {
    if (connectionStatus !== 'connected') {
      console.log('Device not connected');
      return;
    }
    // Real OBD PID reading will be implemented here
    // Using ELM327 commands like "010C" for RPM, "010D" for Speed, etc.
  };

  const readDTC = async () => {
    if (connectionStatus !== 'connected') {
      console.log('Device not connected');
      return;
    }
    // Real DTC reading using "03" command
  };

  const clearDTC = async () => {
    if (connectionStatus !== 'connected') {
      console.log('Device not connected');
      return;
    }
    // Real DTC clearing using "04" command
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

export const useOBD = () => {
  const context = useContext(OBDContext);
  if (!context) {
    throw new Error('useOBD must be used within OBDProvider');
  }
  return context;
};
