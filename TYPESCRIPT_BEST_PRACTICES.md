# TypeScript Type Organization - Best Practices

## ✅ Problem Solved: "Identifier 'DeviceType' has already been declared"

### Root Cause
The file `/app/frontend/contexts/OBDContext.tsx` had **TWO** declarations of `type DeviceType`:
- Line 8: `type DeviceType = 'bluetooth' | 'wifi';`
- Line 248: `type DeviceType = 'bluetooth' | 'wifi';` (duplicate)

This happened due to incomplete `search_replace` operations during development.

### Solution Applied
1. Created `/app/frontend/types/obd.types.ts` for shared types
2. Removed all inline type declarations from `OBDContext.tsx`
3. Imported types using TypeScript `type` imports
4. Rewrote `OBDContext.tsx` cleanly without duplicates

---

## 📁 Type Organization Architecture

### File Structure
```
/app/frontend/
├── types/
│   ├── obd.types.ts          # OBD-II related types
│   ├── auth.types.ts          # Authentication types (future)
│   └── vehicle.types.ts       # Vehicle data types (future)
├── contexts/
│   ├── OBDContext.tsx         # Imports from types/
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
```

### Rules for Type Placement

**✅ DO:**
- Place shared types in `/types/*.types.ts` files
- Use `export type` or `export interface` for all exports
- Import types using `import type { ... }` for clarity
- Group related types in the same file
- Use descriptive file names: `obd.types.ts`, `auth.types.ts`

**❌ DON'T:**
- Declare the same type in multiple files
- Mix business logic with type definitions
- Use `any` type (use proper interfaces)
- Redeclare imported types

---

## 🔧 TypeScript Import Best Practices

### Correct Import Pattern
```typescript
// ✅ CORRECT: Type-only import
import type { DeviceType, OBDData } from '../types/obd.types';

// ✅ ALSO CORRECT: Named import with type keyword
import { type DeviceType, type OBDData } from '../types/obd.types';

// ❌ WRONG: Regular import then redeclare
import { DeviceType } from '../types/obd.types';
type DeviceType = 'bluetooth' | 'wifi'; // ERROR: Already declared!
```

### Type vs Interface
```typescript
// Use TYPE for unions, primitives, tuples
export type DeviceType = 'bluetooth' | 'wifi';
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

// Use INTERFACE for object shapes (better for extension)
export interface OBDData {
  rpm: number;
  speed: number;
  engineLoad: number;
  coolantTemp: number;
  vin: string;
}
```

---

## 📝 Complete Fixed Code

### `/app/frontend/types/obd.types.ts`
```typescript
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
```

### `/app/frontend/contexts/OBDContext.tsx` (excerpt)
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import OBDCore, { OBD_COMMANDS } from '../services/OBDCore';
import { getDTCDescription } from '../data/dtcDatabase';

// ✅ Import types using type-only import
import type {
  DeviceType,
  ConnectionStatus,
  OBDData,
  DTC,
  SelectedVehicle,
  OBDContextType,
} from '../types/obd.types';

const OBDContext = createContext<OBDContextType | undefined>(undefined);

// ... rest of implementation
```

---

## 🎯 Key Takeaways

1. **Single Source of Truth**: Each type should be declared once, in one file
2. **Type-Only Imports**: Use `import type` to make it clear these are compile-time only
3. **Organized Structure**: Group related types in dedicated `/types/` directory
4. **No Redeclaration**: Never redeclare an imported type
5. **Explicit Return Types**: Add return types to functions for better type checking

---

## ✅ Verification Checklist

- [x] `DeviceType` declared only once (in `/types/obd.types.ts`)
- [x] `OBDContext.tsx` imports types instead of declaring them
- [x] No duplicate type declarations
- [x] TypeScript compilation successful
- [x] Expo bundler compiles without "already declared" errors

---

## 🚀 Result

**Error Fixed:** ✅ "Identifier 'DeviceType' has already been declared" is resolved

**Bundle Status:** Compiling successfully (1455 modules)

**Note:** Remaining errors are unrelated to TypeScript types (Canvas/Skia issues)
