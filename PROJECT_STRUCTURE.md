# OBD-II Diagnostik - Project Structure

## 📁 Directory Structure

```
/app
├── frontend/                          # React Native Expo Application
│   ├── app/                          # Expo Router screens
│   │   ├── index.tsx                 # Landing/Home screen
│   │   ├── _layout.tsx               # Root layout with providers
│   │   └── (drawer)/                 # Drawer navigation group
│   │       ├── _layout.tsx           # Drawer configuration
│   │       ├── dashboard.tsx         # Main dashboard with live data
│   │       ├── vehicle-selection.tsx # Vehicle selection flow
│   │       ├── diagnostics.tsx       # DTC reading and advanced modules
│   │       └── settings.tsx          # Theme and device settings
│   │
│   ├── contexts/                     # React Context providers
│   │   ├── ThemeContext.tsx          # Theme management (Dark Sport / Green Metallic)
│   │   └── OBDContext.tsx            # OBD connection and data management
│   │
│   ├── services/                     # Business logic services
│   │   └── OBDCore.ts                # ELM327 OBD-II communication layer
│   │
│   ├── data/                         # Static data and databases
│   │   ├── vehicleDatabase.ts        # Vehicle brands, models, years, engines
│   │   └── dtcDatabase.ts            # DTC codes with Turkish translations
│   │
│   ├── assets/                       # Images, fonts, etc.
│   ├── app.json                      # Expo configuration + permissions
│   ├── package.json                  # Dependencies
│   └── tsconfig.json                 # TypeScript configuration
│
├── backend/                          # FastAPI Backend
│   ├── server.py                     # Main API with endpoints
│   ├── requirements.txt              # Python dependencies
│   └── .env                          # Environment variables
│
├── README_OBD.md                     # Main documentation (Turkish + English)
├── PROJECT_STRUCTURE.md              # This file
└── test_result.md                    # Testing status and communication
```

## 🔧 Key Components

### Frontend Architecture

#### 1. Navigation (`app/`)
- **Expo Router** file-based routing
- **Drawer Navigation** for main menu
- **Stack Navigation** for screen hierarchy

#### 2. State Management (`contexts/`)
- **ThemeContext**: 
  - Manages Dark Sport / Green Metallic themes
  - Persists theme preference in AsyncStorage
  
- **OBDContext**:
  - Bluetooth device management
  - OBD-II connection state
  - Real-time data updates
  - DTC code management
  - Vehicle selection persistence

#### 3. OBD-II Core (`services/OBDCore.ts`)
```typescript
- scanDevices(): Promise<BluetoothDevice[]>
- connect(device): Promise<boolean>
- disconnect(): Promise<void>
- readPID(command): Promise<number | string>
- readVIN(): Promise<string>
- readDTC(): Promise<DTC[]>
- clearDTC(): Promise<boolean>
```

**Supported Commands:**
- `010C` - RPM
- `010D` - Speed (km/h)
- `0104` - Engine Load (%)
- `0105` - Coolant Temperature (°C)
- `0902` - VIN
- `03` - Read DTC
- `04` - Clear DTC

#### 4. Data Layer (`data/`)
- **vehicleDatabase.ts**:
  - 10+ brands (Volkswagen, Audi, BMW, Mercedes, Toyota, Renault, Ford, Fiat, Hyundai, Peugeot)
  - Multiple models per brand
  - Years: 2015-2024
  - Engine variants per model

- **dtcDatabase.ts**:
  - 20+ common DTC codes
  - English descriptions
  - Turkish translations
  - P-codes (Powertrain) focus

### Backend Architecture

#### API Endpoints (`server.py`)

**Vehicles:**
- `POST /api/vehicles` - Create vehicle record
- `GET /api/vehicles` - List all vehicles
- `GET /api/vehicles/{id}` - Get vehicle by ID

**OBD Sessions:**
- `POST /api/obd-sessions` - Save OBD data snapshot
- `GET /api/obd-sessions/{vehicle_id}` - Get session history

**DTC Codes:**
- `POST /api/dtc-codes` - Save DTC code
- `GET /api/dtc-codes/{vehicle_id}` - Get DTC history
- `DELETE /api/dtc-codes/{vehicle_id}` - Clear DTC records

#### Database Models (MongoDB)

```python
VehicleInfo:
  - id: uuid
  - brand: string
  - model: string
  - year: string
  - engine: string
  - vin: string (optional)
  - created_at: datetime

OBDSession:
  - id: uuid
  - vehicle_id: string
  - rpm: int
  - speed: int
  - engine_load: float
  - coolant_temp: int
  - timestamp: datetime

DTCCode:
  - id: uuid
  - vehicle_id: string
  - code: string
  - description: string
  - turkish_description: string
  - timestamp: datetime
```

## 🎨 UI/UX Design

### Theme System

**Dark Sport Theme:**
- Background: `#000000` (Pure black)
- Surface: `#1C1C1E` (Dark gray)
- Primary: `#FF3B30` (Red)
- Accent: `#0A84FF` (Blue)

**Green Metallic Theme:**
- Background: `#0A1F1A` (Dark green)
- Surface: `#1A2F2A` (Green-gray)
- Primary: `#00FF88` (Bright green)
- Accent: `#00FFCC` (Cyan)

### Screen Flow

```
Landing Screen (index.tsx)
    ↓ [Başlat button]
Dashboard (drawer/dashboard.tsx)
    ├─→ Hamburger Menu
    │   ├── Dashboard
    │   ├── Araç Seçimi (Vehicle Selection)
    │   ├── Tanılama (Diagnostics)
    │   └── Ayarlar (Settings)
    │
    ├─→ Connection Status Card
    │   └── [Bağlan button] → OBD device connection
    │
    ├─→ Vehicle Info Card
    │   └── [Tap] → Vehicle Selection
    │
    └─→ Live Data Grid
        ├── RPM
        ├── Speed
        ├── Engine Load
        └── Coolant Temperature

Vehicle Selection (drawer/vehicle-selection.tsx)
    Progress: [Marka] → [Model] → [Yıl] → [Motor]
    └─→ [Tanılamaya Başla] → Back to Dashboard

Diagnostics (drawer/diagnostics.tsx)
    ├─→ Tab: Hata Kodları (DTC)
    │   ├── [Hata Kodlarını Oku] → Read DTCs
    │   ├── [Hata Kodlarını Sil] → Clear DTCs
    │   └── DTC List with Turkish descriptions
    │
    └─→ Tab: Gelişmiş Tanılama
        ├── Throttle Adaptation
        ├── EGR Diagnostics
        ├── ABS Diagnostics
        ├── SAS Calibration
        ├── EPB Service
        ├── Brake Pad Reset
        ├── DPF Regeneration
        ├── TPMS Diagnostics
        └── Oil Service Reset

Settings (drawer/settings.tsx)
    ├─→ Theme Section
    │   ├── Toggle: Dark Sport ↔ Green Metallic
    │   └── Theme Preview Cards
    │
    ├─→ Device Type Section
    │   ├── ● Bluetooth (active)
    │   └── ○ Wi-Fi (architecture ready)
    │
    └─→ Connection Info
        ├── Status indicator
        └── Protocol display
```

## 🔌 OBD-II Communication Flow

```
User Action
    ↓
[Bağlan Button] → OBDContext.connectDevice()
    ↓
Request Bluetooth Permissions (Android)
    ↓
OBDCore.scanDevices() → Find paired OBD devices
    ↓
OBDCore.connect(device) → Establish connection
    ↓
Initialize ELM327:
    - ATZ (Reset)
    - ATE0 (Echo off)
    - ATL0 (Linefeeds off)
    - ATS0 (Spaces off)
    - ATH1 (Headers on)
    - ATSP0 (Auto protocol)
    ↓
Connection Status: CONNECTED
    ↓
Start Data Reading Loop (1Hz)
    ├── Read RPM (010C)
    ├── Read Speed (010D)
    ├── Read Engine Load (0104)
    └── Read Coolant Temp (0105)
    ↓
Update UI in Real-time
```

## 📱 Android Permissions

Required in `app.json`:
```json
"android": {
  "permissions": [
    "BLUETOOTH",
    "BLUETOOTH_ADMIN",
    "BLUETOOTH_CONNECT",
    "BLUETOOTH_SCAN",
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION"
  ]
}
```

## 🚀 Development Workflow

### Frontend
```bash
cd /app/frontend
yarn install
yarn start                    # Development server
expo start --android          # Android emulator
expo start --tunnel           # Remote testing
```

### Backend
```bash
cd /app/backend
pip install -r requirements.txt
uvicorn server:app --reload   # Development server
```

### Build APK
```bash
cd /app/frontend
eas build --profile production --platform android
```

## 🧪 Testing Strategy

### Phase 1: UI/UX Testing ✅
- Visual testing via screenshots
- Navigation flow verification
- Theme switching
- Responsive design

### Phase 2: Backend API Testing 
- CURL/Postman testing
- Endpoint validation
- Data persistence

### Phase 3: Real Hardware Testing
- Requires ELM327 Bluetooth adapter
- Live OBD-II communication
- Protocol detection
- DTC reading/clearing
- Advanced diagnostics

## 📊 Technology Stack

**Frontend:**
- React Native 0.81.5
- Expo 54
- Expo Router 5.1
- TypeScript 5.8
- react-native-bluetooth-classic
- AsyncStorage
- Linear Gradient

**Backend:**
- FastAPI
- Motor (AsyncIO MongoDB driver)
- Python 3.9+
- Pydantic

**Database:**
- MongoDB

**OBD-II:**
- ELM327 Protocol
- Bluetooth Classic (SPP)
- ISO 15765-4 (CAN)
- ISO 9141-2
- KWP2000

## 🔐 Security Considerations

1. **Bluetooth Security**: Only connects to paired devices
2. **Permission Handling**: Runtime permission requests on Android 6+
3. **Error Handling**: Graceful failures, no crashes
4. **Vehicle Safety**: Commands only execute if supported by vehicle
5. **Data Validation**: Input sanitization on backend

## 🎯 Future Enhancements

1. **Wi-Fi Implementation**: Complete WiFi OBD adapter support
2. **Data Logging**: Export diagnostic sessions to CSV/PDF
3. **Cloud Sync**: Backup vehicle profiles and history
4. **Multi-language**: English, German, Arabic support
5. **Advanced Analytics**: Fuel consumption, trip computer
6. **Vehicle Profiles**: Multiple vehicle management
7. **Freeze Frame Data**: Capture conditions when DTC set
8. **Live Graphing**: Real-time charts for PIDs
9. **Custom PIDs**: Support for manufacturer-specific codes
10. **OTA Updates**: Remote app updates

---

**Version**: 1.0.0  
**Last Updated**: January 2025  
**Architecture**: Production-Ready  
**Status**: Phase 1 Complete ✅
