# OBD-II Diagnostik - Professional Automotive Diagnostic Application

## 🚗 Genel Bakış (Overview)

OBD-II Diagnostik, gerçek OBD-II cihazlarıyla çalışan profesyonel bir otomotiv tanılama uygulamasıdır. Bluetooth ve Wi-Fi desteği ile araç verilerini okuyabilir, hata kodlarını görüntüleyebilir ve gelişmiş tanılama işlemleri yapabilirsiniz.

This is a production-ready automotive OBD-II diagnostic application that works with real OBD-II devices. It supports Bluetooth and Wi-Fi connectivity, reads vehicle data, displays fault codes, and performs advanced diagnostic functions.

## ✨ Özellikler (Features)

### 🔌 Bağlantı (Connectivity)
- ✅ Bluetooth OBD-II cihaz desteği
- ✅ Wi-Fi OBD-II cihaz desteği (architecture ready)
- ✅ Otomatik cihaz tarama
- ✅ ELM327 protokol desteği

### 📊 Canlı Veri Okuma (Live Data Reading)
- ✅ Motor devir sayısı (RPM)
- ✅ Araç hızı (km/h)
- ✅ Motor yükü (%)
- ✅ Soğutma suyu sıcaklığı (°C)
- ✅ VIN (Araç Kimlik Numarası) okuma

### 🔧 Hata Kodları (DTC - Diagnostic Trouble Codes)
- ✅ Hata kodlarını okuma
- ✅ Hata kodlarını temizleme
- ✅ Türkçe hata açıklamaları
- ✅ 20+ yaygın hata kodu veritabanı

### 🚙 Araç Veritabanı (Vehicle Database)
- ✅ 10+ global marka desteği (VAG, BMW, Mercedes, Toyota, Renault, Ford, Fiat, Hyundai, Peugeot)
- ✅ Marka → Model → Yıl → Motor seçim akışı
- ✅ Geniş model ve motor varyasyonları

### 🛠️ Gelişmiş Tanılama Modülleri (Advanced Diagnostics)
- ✅ Gaz Kelebeği (Throttle) Adaptasyonu
- ✅ EGR Tanılama
- ✅ ABS Tanılama
- ✅ SAS (Direksiyon Açısı) Kalibrasyonu
- ✅ EPB (Elektronik Park Freni) Servisi
- ✅ Fren Balatası Sıfırlama
- ✅ DPF Rejenerasyonu
- ✅ TPMS Tanılama
- ✅ Yağ Servis Sıfırlama

*Not: Gelişmiş modüller, araç tarafından destekleniyorsa çalıştırılacaktır.*

### 🎨 Tema Sistemi (Theme System)
- ✅ Dark Sport Teması (Kırmızı vurgular)
- ✅ Green Metallic Teması (Yeşil vurgular)
- ✅ Tema değiştirme özelliği
- ✅ Profesyonel otomotiv tasarım

### 📱 Kullanıcı Arayüzü (User Interface)
- ✅ Drawer Navigation (Yan menü)
- ✅ Dashboard (Ana ekran)
- ✅ Araç Seçimi
- ✅ Tanılama Ekranı
- ✅ Ayarlar
- ✅ Türkçe dil desteği

## 🏗️ Teknik Mimari (Technical Architecture)

### Frontend
- **Platform**: React Native with Expo
- **Navigation**: Expo Router + React Navigation Drawer
- **State Management**: React Context API
- **Styling**: StyleSheet with Linear Gradients
- **OBD Communication**: react-native-bluetooth-classic
- **Storage**: AsyncStorage

### Backend
- **Framework**: FastAPI
- **Database**: MongoDB
- **ORM**: Motor (async MongoDB driver)
- **API**: RESTful endpoints

### OBD-II Core
- **Protocol Support**: 
  - ISO 15765-4 (CAN)
  - ISO 9141-2
  - KWP2000
- **Commands**: ELM327 AT commands
- **PIDs**: Mode 01 (Live Data), Mode 03 (DTC), Mode 04 (Clear DTC), Mode 09 (VIN)

## 📦 Kurulum (Installation)

### Gereksinimler (Requirements)
- Node.js 18+
- Yarn
- Python 3.9+
- MongoDB
- Android Studio (for building APK)
- Real OBD-II device (ELM327 Bluetooth/Wi-Fi adapter)

### Frontend Kurulumu
```bash
cd /app/frontend
yarn install
yarn start
```

### Backend Kurulumu
```bash
cd /app/backend
pip install -r requirements.txt
python server.py
```

## 🔐 İzinler (Permissions)

### Android Permissions
- BLUETOOTH
- BLUETOOTH_ADMIN
- BLUETOOTH_CONNECT
- BLUETOOTH_SCAN
- ACCESS_FINE_LOCATION
- ACCESS_COARSE_LOCATION

### iOS Permissions
- NSBluetoothAlwaysUsageDescription
- NSBluetoothPeripheralUsageDescription
- NSLocationWhenInUseUsageDescription

## 🚀 Kullanım (Usage)

### 1. OBD-II Cihazını Bağlama
1. OBD-II cihazınızı aracınızın OBD portuna takın
2. Cihazı telefonunuzla eşleştirin (Bluetooth ayarlarından)
3. Uygulamayı açın
4. Dashboard'da "Bağlan" butonuna tıklayın

### 2. Araç Seçimi
1. Yan menüden "Araç Seçimi"ne gidin
2. Marka → Model → Yıl → Motor seçimi yapın
3. "Tanılamaya Başla" butonuna tıklayın

### 3. Canlı Veri Görüntüleme
- Dashboard'da gerçek zamanlı RPM, hız, motor yükü ve sıcaklık verilerini görün
- Veriler otomatik olarak her saniye güncellenir

### 4. Hata Kodlarını Okuma
1. "Tanılama" sekmesine gidin
2. "Hata Kodları (DTC)" tabını seçin
3. "Hata Kodlarını Oku" butonuna tıklayın
4. Hata kodları Türkçe açıklamalarıyla gösterilecektir

### 5. Gelişmiş Tanılama
1. "Tanılama" sekmesinde "Gelişmiş Tanılama" tabına gidin
2. İstediğiniz modülü seçin
3. Modül araç tarafından destekleniyorsa çalıştırılacaktır

## 📱 APK Oluşturma (Build APK)

### Development Build
```bash
cd /app/frontend
eas build --profile development --platform android
```

### Production Build
```bash
cd /app/frontend
eas build --profile production --platform android
```

## 🗄️ API Endpoints

### Vehicles
- `POST /api/vehicles` - Create vehicle record
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/{vehicle_id}` - Get specific vehicle

### OBD Sessions
- `POST /api/obd-sessions` - Save OBD data
- `GET /api/obd-sessions/{vehicle_id}` - Get session history

### DTC Codes
- `POST /api/dtc-codes` - Save DTC code
- `GET /api/dtc-codes/{vehicle_id}` - Get DTC history
- `DELETE /api/dtc-codes/{vehicle_id}` - Clear DTC codes

## 🎨 Tema Değiştirme (Change Theme)

1. Ayarlar sekmesine gidin
2. Tema bölümünde toggle switch'i kullanın
3. Dark Sport ↔ Green Metallic arası geçiş yapın

## 🔒 Güvenlik (Security)

- ✅ Cihaz bağlantıları güvenli şekilde yönetilir
- ✅ Hata işleme mekanizması
- ✅ Araç desteklemiyorsa komutlar çalıştırılmaz
- ✅ Kullanıcı onayı gerektiren işlemler

## 🐛 Bilinen Sınırlamalar (Known Limitations)

1. **Wi-Fi Desteği**: Wi-Fi bağlantı mimarisi hazır ancak implementasyon tamamlanmamıştır
2. **Araç Uyumluluğu**: Tüm araçlar tüm gelişmiş modülleri desteklemeyebilir
3. **Real Device Requirement**: Uygulama gerçek OBD-II cihazı gerektirir, simulasyon yapmaz

## 📚 Desteklenen Protokoller (Supported Protocols)

1. **ISO 15765-4 (CAN)**: Modern araçlar için (2008+)
2. **ISO 9141-2**: Eski araçlar için
3. **KWP2000**: Volkswagen Group araçları

## 🔧 Troubleshooting

### Cihaz Bulunamadı
- OBD-II cihazınızın eşleştirildiğinden emin olun
- Bluetooth izinlerinin verildiğini kontrol edin
- Cihazın OBD portuna düzgün takıldığını kontrol edin

### Bağlantı Hatası
- Kontak açık olmalıdır
- OBD-II cihazı çalışıyor olmalıdır (LED ışığı)
- Bluetooth bağlantısı aktif olmalıdır

### Veri Okumuyor
- Araç çalışıyor olmalıdır
- OBD-II protokolü otomatik algılanmalıdır
- Bazı araçlarda motor çalışırken daha iyi sonuç alınır

## 📄 Lisans (License)

This project is built for production use with real OBD-II hardware.

## 👨‍💻 Geliştirici Notları (Developer Notes)

### OBD Core Implementation
- ELM327 command abstraction layer
- Async Bluetooth communication
- PID parsing and data conversion
- DTC decoding from hex values

### Future Enhancements
- Wi-Fi OBD implementation
- Data logging and export
- Vehicle profile management
- Multi-language support (English, German, etc.)
- Cloud sync for diagnostic history
- Advanced graphing and analytics

## 📞 Destek (Support)

For technical support or questions about OBD-II compatibility, please check:
- Your OBD-II adapter documentation
- Vehicle service manual
- ELM327 command reference

---

**Hazırlayan (Developed by)**: OBD-II Diagnostik Team  
**Versiyon (Version)**: 1.0.0  
**Tarih (Date)**: 2025

**🚗 Güvenli sürüşler! Safe driving!**
