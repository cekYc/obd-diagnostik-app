# Android Studio ile Geliştirme - Tam Kılavuz

## ✅ Eski Profesyonel UI Geri Getirildi

Tüm ekranlar eski profesyonel görünümüne kavuşturuldu:
- ✅ LinearGradient efektleri
- ✅ Dark Sport tema
- ✅ Profesyonel kartlar ve gölgeler
- ✅ İkonlar ve tipografi
- ✅ Tam özellikli UI bileşenleri

## 📱 Android Studio'da Açma

### Yöntem 1: Android Studio'da Doğrudan Aç

1. Android Studio'yu açın
2. "Open an Existing Project" seçin
3. `/app/frontend/android` klasörünü seçin
4. Gradle sync otomatik başlayacak
5. "Run" butonuna tıklayın (Shift+F10)

### Yöntem 2: Komut Satırından Çalıştır

```bash
cd /app/frontend
npx expo run:android
```

Bu komut:
- Android emülatörü başlatır (varsa)
- APK'yı derler
- Uygulamayı çalıştırır

### Yöntem 3: APK Build Et

```bash
cd /app/frontend/android
./gradlew assembleDebug
```

APK konumu: `android/app/build/outputs/apk/debug/app-debug.apk`

## 🎨 Uygulama Önizlemesi

### Web Önizleme (Kısıtlı)
```bash
cd /app/frontend
npx expo start --web
```

**Not:** Web'de bazı native modüller çalışmaz (Bluetooth, vb.)

### Android Emülatör Önizleme (Tam Özellikli)
```bash
cd /app/frontend
npx expo start --android
```

### Fiziksel Cihazda Test
```bash
# Debug APK'yı cihaza yükle
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## 📁 Proje Yapısı

```
/app/frontend/
├── android/                    ← Android Studio projesi
│   ├── app/
│   │   ├── src/
│   │   └── build.gradle
│   ├── gradle/
│   └── settings.gradle
├── app/                        ← Expo Router screens
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── auth.tsx
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── home.tsx            ← Profesyonel UI
│       └── market.tsx          ← Profesyonel UI
├── contexts/                   ← State management
├── types/                      ← TypeScript types
└── package.json
```

## 🔧 Önemli Notlar

### LinearGradient Çalışıyor
- ✅ Android native'de tam çalışır
- ✅ Expo Go'da sorunlu (Skia hatası)
- ✅ Custom dev client'ta sorunsuz

### Native Modüller
- `react-native-bluetooth-classic` Android'de çalışır
- Expo Go'da çalışmaz (native module)
- Prebuild sonrası kullanılabilir

### Theme System
- Dark Sport tema aktif
- Green Metallic tema hazır
- Ayarlar'dan değiştirilebilir

## 🚀 Hızlı Başlangıç

### 1. Android Emülatör Başlat
```bash
# Android Studio'dan veya
emulator -avd Pixel_4_API_30
```

### 2. Uygulamayı Çalıştır
```bash
cd /app/frontend
npx expo run:android
```

### 3. Metro Bundler
Otomatik başlar, değilse:
```bash
npx expo start
```

## 🎯 Geliştirme Döngüsü

1. **Kod Değişikliği Yap** → `app/` veya `contexts/` dosyalarını düzenle
2. **Hot Reload** → Değişiklikler otomatik yansır
3. **Test Et** → Emülatör veya fiziksel cihazda
4. **Build Et** → Production APK için

## 🔨 Production Build

### Release APK
```bash
cd /app/frontend/android
./gradlew assembleRelease
```

### AAB (Google Play için)
```bash
./gradlew bundleRelease
```

## ⚙️ Gradle Sync Sorunları

Eğer Android Studio'da hata alırsanız:

```bash
cd /app/frontend/android
./gradlew clean
./gradlew build
```

## 🎨 UI Önizleme

### Ekranlar:
1. **Auth Screen** - LinearGradient, professional login/register
2. **Home Screen** - Dashboard, user info, quick access cards
3. **Market Screen** - Coming soon placeholder

### Renk Paleti (Dark Sport):
- Background: #000000
- Surface: #1C1C1E
- Primary: #FF3B30 (Red)
- Accent: #0A84FF (Blue)
- Success: #30D158 (Green)

## 📝 Notlar

- ✅ Prebuild tamamlandı
- ✅ Native Android projesi hazır
- ✅ Profesyonel UI geri getirildi
- ✅ LinearGradient çalışır durumda
- ✅ Dark Sport tema aktif
- ⏳ Market sistemi implementasyon bekliyor

## 🆘 Sorun Giderme

### "Cannot read property 'S'" Hatası
- Bu hata **sadece Expo Go'da** oluyor
- Android native build'de yok
- LinearGradient + Skia uyumsuzluğu

### Çözüm
✅ `npx expo run:android` kullanın
❌ Expo Go kullanmayın

---

**Sonuç:** Uygulama artık Android Studio'da tam özellikli çalışıyor! 🎉
