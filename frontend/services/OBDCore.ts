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

/**
 * ELM327 Command Interface for OBD-II Communication
 * Supports ISO 15765-4 (CAN), ISO 9141-2, and KWP2000 protocols
 */

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
    parser: (response: string) => {
      const bytes = parseHexResponse(response);
      if (bytes.length >= 2) {
        return ((bytes[0] * 256) + bytes[1]) / 4;
      }
      return 0;
    },
  },
  SPEED: {
    pid: '010D',
    name: 'Vehicle Speed',
    description: 'Araç hızı',
    parser: (response: string) => {
      const bytes = parseHexResponse(response);
      if (bytes.length >= 1) {
        return bytes[0];
      }
      return 0;
    },
  },
  ENGINE_LOAD: {
    pid: '0104',
    name: 'Engine Load',
    description: 'Motor yükü',
    parser: (response: string) => {
      const bytes = parseHexResponse(response);
      if (bytes.length >= 1) {
        return (bytes[0] * 100) / 255;
      }
      return 0;
    },
  },
  COOLANT_TEMP: {
    pid: '0105',
    name: 'Coolant Temperature',
    description: 'Soğutma suyu sıcaklığı',
    parser: (response: string) => {
      const bytes = parseHexResponse(response);
      if (bytes.length >= 1) {
        return bytes[0] - 40;
      }
      return 0;
    },
  },
};

// Helper function to parse hex response
const parseHexResponse = (response: string): number[] => {
  // Remove spaces and non-hex characters
  const cleaned = response.replace(/[^0-9A-Fa-f]/g, '');
  const bytes: number[] = [];
  
  // Skip the first 4 characters (mode + PID response)
  for (let i = 4; i < cleaned.length; i += 2) {
    const byte = cleaned.substr(i, 2);
    if (byte.length === 2) {
      bytes.push(parseInt(byte, 16));
    }
  }
  
  return bytes;
};

export class OBDCore {
  private device: BluetoothDevice | null = null;
  private connected: boolean = false;

  /**
   * Scan for available Bluetooth devices
   */
  async scanDevices(): Promise<BluetoothDevice[]> {
    try {
      const paired = await RNBluetoothClassic.getBondedDevices();
      return paired.filter(device => 
        device.name?.toLowerCase().includes('obd') || 
        device.name?.toLowerCase().includes('elm')
      );
    } catch (error) {
      console.error('Error scanning devices:', error);
      return [];
    }
  }

  /**
   * Connect to OBD-II device
   */
  async connect(device: BluetoothDevice): Promise<boolean> {
    try {
      const isConnected = await device.connect();
      
      if (isConnected) {
        this.device = device;
        this.connected = true;
        
        // Initialize ELM327
        await this.sendCommand('ATZ'); // Reset
        await this.delay(1000);
        await this.sendCommand('ATE0'); // Echo off
        await this.sendCommand('ATL0'); // Linefeeds off
        await this.sendCommand('ATS0'); // Spaces off
        await this.sendCommand('ATH1'); // Headers on
        await this.sendCommand('ATSP0'); // Auto protocol detection
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Connection error:', error);
      this.connected = false;
      return false;
    }
  }

  /**
   * Disconnect from device
   */
  async disconnect(): Promise<void> {
    try {
      if (this.device && this.connected) {
        await this.device.disconnect();
      }
    } catch (error) {
      console.error('Disconnect error:', error);
    } finally {
      this.device = null;
      this.connected = false;
    }
  }

  /**
   * Send command to OBD device
   */
  private async sendCommand(command: string): Promise<string> {
    if (!this.device || !this.connected) {
      throw new Error('Device not connected');
    }

    try {
      await this.device.write(`${command}\r`);
      await this.delay(200); // Wait for response
      
      const response = await this.device.read();
      return response || '';
    } catch (error) {
      console.error('Command error:', error);
      return '';
    }
  }

  /**
   * Read OBD PID
   */
  async readPID(command: OBDCommand): Promise<number | string> {
    try {
      const response = await this.sendCommand(command.pid);
      return command.parser(response);
    } catch (error) {
      console.error('Read PID error:', error);
      return 0;
    }
  }

  /**
   * Read VIN (Vehicle Identification Number)
   */
  async readVIN(): Promise<string> {
    try {
      const response = await this.sendCommand('0902');
      // Parse VIN from response
      const cleaned = response.replace(/[^0-9A-Za-z]/g, '');
      return cleaned.substring(0, 17);
    } catch (error) {
      console.error('Read VIN error:', error);
      return '';
    }
  }

  /**
   * Read Diagnostic Trouble Codes (DTCs)
   */
  async readDTC(): Promise<Array<{ code: string; description: string }>> {
    try {
      const response = await this.sendCommand('03');
      return this.parseDTCResponse(response);
    } catch (error) {
      console.error('Read DTC error:', error);
      return [];
    }
  }

  /**
   * Clear Diagnostic Trouble Codes
   */
  async clearDTC(): Promise<boolean> {
    try {
      await this.sendCommand('04');
      return true;
    } catch (error) {
      console.error('Clear DTC error:', error);
      return false;
    }
  }

  /**
   * Parse DTC response
   */
  private parseDTCResponse(response: string): Array<{ code: string; description: string }> {
    const dtcs: Array<{ code: string; description: string }> = [];
    const cleaned = response.replace(/[^0-9A-Fa-f]/g, '');
    
    // Skip first 2 characters (response mode)
    for (let i = 2; i < cleaned.length; i += 4) {
      const dtcHex = cleaned.substr(i, 4);
      if (dtcHex.length === 4 && dtcHex !== '0000') {
        const code = this.decodeDTC(dtcHex);
        if (code) {
          dtcs.push({
            code,
            description: 'DTC detected',
          });
        }
      }
    }
    
    return dtcs;
  }

  /**
   * Decode DTC from hex
   */
  private decodeDTC(hex: string): string | null {
    const value = parseInt(hex, 16);
    const firstChar = ['P', 'C', 'B', 'U'][Math.floor(value / 16384)];
    const secondChar = Math.floor((value % 16384) / 4096);
    const thirdDigit = Math.floor((value % 4096) / 256);
    const fourthDigit = Math.floor((value % 256) / 16);
    const fifthDigit = value % 16;
    
    return `${firstChar}${secondChar}${thirdDigit}${fourthDigit}${fifthDigit}`;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Helper delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new OBDCore();
