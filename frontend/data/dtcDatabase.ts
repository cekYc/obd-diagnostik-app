export interface DTCCode {
  code: string;
  description: string;
  turkishDescription: string;
}

export const dtcDatabase: DTCCode[] = [
  {
    code: 'P0300',
    description: 'Random/Multiple Cylinder Misfire Detected',
    turkishDescription: 'Rastgele/Çoklu Silindir Ateşleme Hatası Tespit Edildi',
  },
  {
    code: 'P0301',
    description: 'Cylinder 1 Misfire Detected',
    turkishDescription: '1. Silindir Ateşleme Hatası Tespit Edildi',
  },
  {
    code: 'P0302',
    description: 'Cylinder 2 Misfire Detected',
    turkishDescription: '2. Silindir Ateşleme Hatası Tespit Edildi',
  },
  {
    code: 'P0303',
    description: 'Cylinder 3 Misfire Detected',
    turkishDescription: '3. Silindir Ateşleme Hatası Tespit Edildi',
  },
  {
    code: 'P0304',
    description: 'Cylinder 4 Misfire Detected',
    turkishDescription: '4. Silindir Ateşleme Hatası Tespit Edildi',
  },
  {
    code: 'P0171',
    description: 'System Too Lean (Bank 1)',
    turkishDescription: 'Sistem Çok Zayıf (Banka 1)',
  },
  {
    code: 'P0172',
    description: 'System Too Rich (Bank 1)',
    turkishDescription: 'Sistem Çok Zengin (Banka 1)',
  },
  {
    code: 'P0420',
    description: 'Catalyst System Efficiency Below Threshold (Bank 1)',
    turkishDescription: 'Katalitik Konvertör Verimliliği Eşiğin Altında (Banka 1)',
  },
  {
    code: 'P0442',
    description: 'Evaporative Emission Control System Leak Detected (Small Leak)',
    turkishDescription: 'Buharlaşma Emisyon Kontrol Sisteminde Sızıntı (Küçük Sızıntı)',
  },
  {
    code: 'P0455',
    description: 'Evaporative Emission Control System Leak Detected (Large Leak)',
    turkishDescription: 'Buharlaşma Emisyon Kontrol Sisteminde Sızıntı (Büyük Sızıntı)',
  },
  {
    code: 'P0128',
    description: 'Coolant Thermostat (Coolant Temperature Below Thermostat Regulating Temperature)',
    turkishDescription: 'Soğutma Suyu Termostatı (Soğutma Suyu Sıcaklığı Termostat Düzenleme Sıcaklığının Altında)',
  },
  {
    code: 'P0401',
    description: 'Exhaust Gas Recirculation Flow Insufficient Detected',
    turkishDescription: 'Egzoz Gazı Geri Dönüşüm Akışı Yetersiz',
  },
  {
    code: 'P0500',
    description: 'Vehicle Speed Sensor Malfunction',
    turkishDescription: 'Araç Hız Sensörü Arızası',
  },
  {
    code: 'P0606',
    description: 'ECM/PCM Processor Fault',
    turkishDescription: 'Motor Kontrol Ünitesi İşlemci Hatası',
  },
  {
    code: 'P0113',
    description: 'Intake Air Temperature Circuit High Input',
    turkishDescription: 'Giriş Hava Sıcaklığı Devresi Yüksek Giriş',
  },
  {
    code: 'P0118',
    description: 'Engine Coolant Temperature Circuit High Input',
    turkishDescription: 'Motor Soğutma Suyu Sıcaklığı Devresi Yüksek Giriş',
  },
  {
    code: 'P0335',
    description: 'Crankshaft Position Sensor Circuit Malfunction',
    turkishDescription: 'Krank Mili Konum Sensörü Devre Arızası',
  },
  {
    code: 'P0340',
    description: 'Camshaft Position Sensor Circuit Malfunction',
    turkishDescription: 'Eksantrik Mili Konum Sensörü Devre Arızası',
  },
  {
    code: 'P0410',
    description: 'Secondary Air Injection System Malfunction',
    turkishDescription: 'İkincil Hava Enjeksiyon Sistemi Arızası',
  },
  {
    code: 'P0715',
    description: 'Input/Turbine Speed Sensor Circuit Malfunction',
    turkishDescription: 'Giriş/Türbin Hız Sensörü Devre Arızası',
  },
];

export const getDTCDescription = (code: string): DTCCode | undefined => {
  return dtcDatabase.find(dtc => dtc.code === code);
};
