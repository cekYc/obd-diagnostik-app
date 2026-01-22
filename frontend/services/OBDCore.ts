// OBDCore.ts - Mock implementation for Expo Go
// Note: react-native-bluetooth-classic requires custom dev client, not supported in Expo Go

export interface OBDCommand {
  pid: string;
  name: string;
  description: string;
  parser: (response: string) => number | string;
}

// OBD-II Mode 01 PIDs (Live Data)
export const OBD_COMMANDS: Record<string, OBDCommand> = {
  RPM: {
    pid: '010C',
    name: 'Engine RPM',
    description: 'Motor devir sayısı',
    parser: (response: string) => 0,
  },
  SPEED: {
    pid: '010D',
    name: 'Vehicle Speed',
    description: 'Araç hızı',
    parser: (response: string) => 0,
  },
  ENGINE_LOAD: {
    pid: '0104',
    name: 'Engine Load',
    description: 'Motor yükü',
    parser: (response: string) => 0,
  },
  COOLANT_TEMP: {
    pid: '0105',
    name: 'Coolant Temperature',
    description: 'Soğutma suyu sıcaklığı',
    parser: (response: string) => 0,
  },
};

export class OBDCore {
  private connected: boolean = false;

  async scanDevices(): Promise<any[]> {
    console.log('OBD: Bluetooth Classic requires custom dev client');
    return [];
  }

  async connect(device: any): Promise<boolean> {
    console.log('OBD: Mock connection');
    return false;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  async readPID(command: OBDCommand): Promise<number | string> {
    return 0;
  }

  async readVIN(): Promise<string> {
    return '';
  }

  async readDTC(): Promise<Array<{ code: string; description: string }>> {
    return [];
  }

  async clearDTC(): Promise<boolean> {
    return true;
  }

  isConnected(): boolean {
    return this.connected;
  }
}

export default new OBDCore();
