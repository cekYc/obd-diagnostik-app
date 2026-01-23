// OBD-II Diagnostic Modules Configuration

export interface DiagnosticModule {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  category: 'engine' | 'transmission' | 'brakes' | 'suspension' | 'electronics' | 'emissions' | 'comfort';
  image: string;
  prices: {
    '1day': number;
    '1week': number;
    '1month': number;
    '6months': number;
    '1year': number;
  };
  color: string;
}

export const DIAGNOSTIC_MODULES: DiagnosticModule[] = [
  // ENGINE MODULES
  {
    id: 'dpf_regeneration',
    name: 'DPF Rejenerasyonu',
    nameEn: 'DPF Regeneration',
    description: 'Dizel Partiküler Filtresi zorlamalı rejenerasyonu',
    icon: 'filter-outline',
    category: 'emissions',
    image: '🔥',
    prices: { '1day': 100, '1week': 500, '1month': 1500, '6months': 7000, '1year': 12000 },
    color: '#FF6B6B'
  },
  {
    id: 'dpf_cancel',
    name: 'DPF İptali',
    nameEn: 'DPF Delete',
    description: 'DPF sistemini devre dışı bırakma',
    icon: 'close-circle-outline',
    category: 'emissions',
    image: '🚫',
    prices: { '1day': 200, '1week': 1000, '1month': 3000, '6months': 15000, '1year': 25000 },
    color: '#FF3B30'
  },
  {
    id: 'oil_service_reset',
    name: 'Yağ Servis Sıfırlama',
    nameEn: 'Oil Service Reset',
    description: 'Motor yağı değişim göstergesini sıfırlama',
    icon: 'water-outline',
    category: 'engine',
    image: '🛢️',
    prices: { '1day': 25, '1week': 100, '1month': 300, '6months': 1200, '1year': 2000 },
    color: '#4ECDC4'
  },
  {
    id: 'throttle_adaptation',
    name: 'Gaz Kelebeği Adaptasyonu',
    nameEn: 'Throttle Body Adaptation',
    description: 'Gaz kelebeği konum sensörü kalibrasyonu',
    icon: 'speedometer-outline',
    category: 'engine',
    image: '⚙️',
    prices: { '1day': 50, '1week': 200, '1month': 600, '6months': 2500, '1year': 4000 },
    color: '#95E1D3'
  },
  {
    id: 'injector_coding',
    name: 'Enjektör Kodlama',
    nameEn: 'Injector Coding',
    description: 'Yeni enjektörlerin ECU\'ya kodlanması',
    icon: 'git-branch-outline',
    category: 'engine',
    image: '💉',
    prices: { '1day': 150, '1week': 700, '1month': 2000, '6months': 9000, '1year': 15000 },
    color: '#F38181'
  },
  {
    id: 'egr_diagnostics',
    name: 'EGR Tanılama',
    nameEn: 'EGR Diagnostics',
    description: 'Egzoz Gazı Geri Dönüşüm sistemi kontrolü',
    icon: 'swap-horizontal-outline',
    category: 'emissions',
    image: '♻️',
    prices: { '1day': 50, '1week': 250, '1month': 750, '6months': 3000, '1year': 5000 },
    color: '#A8E6CF'
  },
  
  // TRANSMISSION MODULES
  {
    id: 'clutch_adaptation',
    name: 'Kavrama Temel Ayarı',
    nameEn: 'Clutch Basic Setting',
    description: 'DSG/S-Tronic kavrama adaptasyonu',
    icon: 'disc-outline',
    category: 'transmission',
    image: '🔄',
    prices: { '1day': 100, '1week': 500, '1month': 1500, '6months': 7000, '1year': 12000 },
    color: '#FFD93D'
  },
  {
    id: 'transmission_adaptation',
    name: 'Şanzıman Adaptasyonu',
    nameEn: 'Transmission Adaptation',
    description: 'Otomatik şanzıman öğrenme değerleri sıfırlama',
    icon: 'settings-outline',
    category: 'transmission',
    image: '⚙️',
    prices: { '1day': 75, '1week': 350, '1month': 1000, '6months': 4500, '1year': 7500 },
    color: '#6BCB77'
  },
  {
    id: 'gearbox_calibration',
    name: 'Vites Kutusu Kalibrasyonu',
    nameEn: 'Gearbox Calibration',
    description: 'Şanzıman kontrol ünitesi kalibrasyonu',
    icon: 'layers-outline',
    category: 'transmission',
    image: '📊',
    prices: { '1day': 100, '1week': 500, '1month': 1500, '6months': 7000, '1year': 12000 },
    color: '#4D96FF'
  },

  // BRAKES & SAFETY
  {
    id: 'abs_diagnostics',
    name: 'ABS Tanılama',
    nameEn: 'ABS Diagnostics',
    description: 'Fren sistemi ve ABS kontrol modülü',
    icon: 'alert-circle-outline',
    category: 'brakes',
    image: '🛑',
    prices: { '1day': 75, '1week': 350, '1month': 1000, '6months': 4500, '1year': 7500 },
    color: '#FF6B6B'
  },
  {
    id: 'epb_service',
    name: 'EPB Servis Modu',
    nameEn: 'EPB Service Mode',
    description: 'Elektronik park freni bakım modu',
    icon: 'hand-left-outline',
    category: 'brakes',
    image: '🅿️',
    prices: { '1day': 75, '1week': 350, '1month': 1000, '6months': 4500, '1year': 7500 },
    color: '#FFA07A'
  },
  {
    id: 'brake_pad_reset',
    name: 'Fren Balata Sıfırlama',
    nameEn: 'Brake Pad Reset',
    description: 'Fren balata sensörü sıfırlama',
    icon: 'disc-outline',
    category: 'brakes',
    image: '🔴',
    prices: { '1day': 50, '1week': 200, '1month': 600, '6months': 2500, '1year': 4000 },
    color: '#E74C3C'
  },
  {
    id: 'sas_calibration',
    name: 'Direksiyon Açı Sensörü',
    nameEn: 'Steering Angle Sensor',
    description: 'SAS kalibrasyonu ve sıfırlama',
    icon: 'compass-outline',
    category: 'suspension',
    image: '🧭',
    prices: { '1day': 100, '1week': 500, '1month': 1500, '6months': 7000, '1year': 12000 },
    color: '#3498DB'
  },

  // TIRE & SUSPENSION
  {
    id: 'tpms_diagnostics',
    name: 'TPMS Tanılama',
    nameEn: 'TPMS Diagnostics',
    description: 'Lastik basınç izleme sistemi',
    icon: 'radio-button-on-outline',
    category: 'suspension',
    image: '⭕',
    prices: { '1day': 50, '1week': 250, '1month': 750, '6months': 3000, '1year': 5000 },
    color: '#9B59B6'
  },
  {
    id: 'tpms_reset',
    name: 'TPMS Sıfırlama',
    nameEn: 'TPMS Reset',
    description: 'Lastik sensörleri yeniden öğrenme',
    icon: 'refresh-outline',
    category: 'suspension',
    image: '🔄',
    prices: { '1day': 35, '1week': 150, '1month': 450, '6months': 1800, '1year': 3000 },
    color: '#8E44AD'
  },
  {
    id: 'suspension_calibration',
    name: 'Süspansiyon Kalibrasyonu',
    nameEn: 'Suspension Calibration',
    description: 'Adaptif süspansiyon ayarı',
    icon: 'git-network-outline',
    category: 'suspension',
    image: '🔧',
    prices: { '1day': 100, '1week': 500, '1month': 1500, '6months': 7000, '1year': 12000 },
    color: '#16A085'
  },

  // ELECTRONICS & COMFORT
  {
    id: 'airbag_reset',
    name: 'Airbag Sıfırlama',
    nameEn: 'Airbag Reset',
    description: 'Airbag hata kodları temizleme',
    icon: 'shield-checkmark-outline',
    category: 'electronics',
    image: '🛡️',
    prices: { '1day': 100, '1week': 500, '1month': 1500, '6months': 7000, '1year': 12000 },
    color: '#E67E22'
  },
  {
    id: 'battery_registration',
    name: 'Akü Kayıt',
    nameEn: 'Battery Registration',
    description: 'Yeni akü ECU\'ya kaydetme',
    icon: 'battery-charging-outline',
    category: 'electronics',
    image: '🔋',
    prices: { '1day': 50, '1week': 250, '1month': 750, '6months': 3000, '1year': 5000 },
    color: '#27AE60'
  },
  {
    id: 'key_programming',
    name: 'Anahtar Programlama',
    nameEn: 'Key Programming',
    description: 'Yeni anahtar eşleştirme',
    icon: 'key-outline',
    category: 'electronics',
    image: '🔑',
    prices: { '1day': 200, '1week': 1000, '1month': 3000, '6months': 14000, '1year': 24000 },
    color: '#F39C12'
  },
  {
    id: 'window_calibration',
    name: 'Cam Kalibrasyonu',
    nameEn: 'Window Calibration',
    description: 'Elektrikli cam sistemleri öğrenme',
    icon: 'square-outline',
    category: 'comfort',
    image: '🪟',
    prices: { '1day': 25, '1week': 100, '1month': 300, '6months': 1200, '1year': 2000 },
    color: '#3498DB'
  },
  {
    id: 'sunroof_calibration',
    name: 'Sunroof Kalibrasyonu',
    nameEn: 'Sunroof Calibration',
    description: 'Elektrikli tavan öğrenme',
    icon: 'sunny-outline',
    category: 'comfort',
    image: '☀️',
    prices: { '1day': 35, '1week': 150, '1month': 450, '6months': 1800, '1year': 3000 },
    color: '#F1C40F'
  },
  {
    id: 'seat_calibration',
    name: 'Koltuk Kalibrasyonu',
    nameEn: 'Seat Calibration',
    description: 'Elektrikli koltuk hafıza sıfırlama',
    icon: 'bed-outline',
    category: 'comfort',
    image: '💺',
    prices: { '1day': 35, '1week': 150, '1month': 450, '6months': 1800, '1year': 3000 },
    color: '#95A5A6'
  },

  // ADVANCED FEATURES
  {
    id: 'immobilizer_reset',
    name: 'İmmobilizer Sıfırlama',
    nameEn: 'Immobilizer Reset',
    description: 'Motor kilidi ve güvenlik sistemi',
    icon: 'lock-closed-outline',
    category: 'electronics',
    image: '🔒',
    prices: { '1day': 150, '1week': 750, '1month': 2250, '6months': 10000, '1year': 17000 },
    color: '#E74C3C'
  },
  {
    id: 'coding_activation',
    name: 'Kodlama ve Aktivasyon',
    nameEn: 'Coding & Activation',
    description: 'Gizli özellikleri aktifleştirme',
    icon: 'code-slash-outline',
    category: 'electronics',
    image: '💻',
    prices: { '1day': 200, '1week': 1000, '1month': 3000, '6months': 14000, '1year': 24000 },
    color: '#9B59B6'
  },
  {
    id: 'user_data_read',
    name: 'Kullanıcı Verisi Okuma',
    nameEn: 'User Data Reading',
    description: 'ECU kullanıcı verileri ve ayarlar',
    icon: 'person-outline',
    category: 'electronics',
    image: '👤',
    prices: { '1day': 50, '1week': 250, '1month': 750, '6months': 3000, '1year': 5000 },
    color: '#3498DB'
  },
  {
    id: 'live_data_monitoring',
    name: 'Canlı Veri İzleme',
    nameEn: 'Live Data Monitoring',
    description: 'Gerçek zamanlı sensör verileri',
    icon: 'pulse-outline',
    category: 'engine',
    image: '📊',
    prices: { '1day': 50, '1week': 200, '1month': 600, '6months': 2500, '1year': 4000 },
    color: '#1ABC9C'
  },
];

export const MODULE_CATEGORIES = {
  engine: { name: 'Motor', icon: 'car-sport-outline', color: '#FF6B6B' },
  transmission: { name: 'Şanzıman', icon: 'settings-outline', color: '#4ECDC4' },
  brakes: { name: 'Fren Sistemi', icon: 'alert-circle-outline', color: '#95E1D3' },
  suspension: { name: 'Süspansiyon', icon: 'git-network-outline', color: '#F38181' },
  electronics: { name: 'Elektronik', icon: 'flash-outline', color: '#A8E6CF' },
  emissions: { name: 'Emisyon', icon: 'leaf-outline', color: '#FFD93D' },
  comfort: { name: 'Konfor', icon: 'star-outline', color: '#6BCB77' },
};
