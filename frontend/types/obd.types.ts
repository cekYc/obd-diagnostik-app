// OBD-II related types for the diagnostic application

export type DeviceType = 'bluetooth' | 'wifi';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface OBDData {
  rpm: number;
  speed: number;
  engineLoad: number;
  coolantTemp: number;
  vin: string;
}

export interface DTC {
  code: string;
  description: string;
}

export interface SelectedVehicle {
  brand: string;
  model: string;
  year: string;
  engine: string;
}

export interface OBDContextType {
  deviceType: DeviceType;
  setDeviceType: (type: DeviceType) => void;
  connectionStatus: ConnectionStatus;
  obdData: OBDData;
  dtcCodes: DTC[];
  selectedVehicle: SelectedVehicle | null;
  setSelectedVehicle: (vehicle: SelectedVehicle) => void;
  connectDevice: () => Promise<void>;
  disconnectDevice: () => void;
  readOBDData: () => Promise<void>;
  readDTC: () => Promise<void>;
  clearDTC: () => Promise<void>;
}
