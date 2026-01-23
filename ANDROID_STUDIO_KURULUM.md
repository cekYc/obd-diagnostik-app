# 📱 OBD-II Diagnostik - Android Studio Kurulum Rehberi

## 🔧 Gereksinimler

### Yazılım Gereksinimleri
- **Android Studio** (En son sürüm - Koala veya daha yeni)
- **JDK 17** (Android Studio ile birlikte gelir)
- **Node.js 20+**
- **Yarn** paket yöneticisi

### Emülatör Gereksinimleri
- **API Level 24+** (Android 7.0+)
- **Google Play Services** (Bluetooth simülasyonu için önerilir)

---

## 🚀 Adım Adım Kurulum

### Adım 1: Projeyi İndirin
```bash
# Projeyi ZIP olarak indirin veya git clone yapın
```

### Adım 2: Bağımlılıkları Yükleyin
```bash
cd frontend
yarn install
```

### Adım 3: Android Klasörünü Oluşturun (İlk kez)
```bash
npx expo prebuild --platform android
```

### Adım 4: Android Studio'da Açın
1. Android Studio'yu açın
2. **"Open"** seçeneğini tıklayın
3. `frontend/android` klasörünü seçin
4. Gradle sync'in tamamlanmasını bekleyin (3-5 dakika sürebilir)

### Adım 5: Emülatör Oluşturun
1. **Tools > Device Manager** menüsüne gidin
2. **"Create Device"** tıklayın
3. Cihaz seçin (örn: Pixel 6)
4. **API 34** (Android 14) veya **API 35** sistem image'ı seçin
5. **Next > Finish** tıklayın

### Adım 6: Metro Bundler'ı Başlatın
Terminal'de:
```bash
cd frontend
npx expo start
```

### Adım 7: Uygulamayı Çalıştırın
Android Studio'da:
1. Emülatörü seçin
2. ▶️ **Run** butonuna tıklayın
3. İlk build ~5 dakika sürebilir

---

## ⚠️ Sık Karşılaşılan Hatalar ve Çözümleri

### Hata 1: Kotlin Versiyon Uyumsuzluğu
```
KSP/Kotlin version mismatch
```
**Çözüm:** `android/gradle.properties` dosyasına ekleyin:
```properties
kotlin.version=2.0.21
```

### Hata 2: SDK Bulunamadı
```
SDK location not found
```
**Çözüm:** `android/local.properties` dosyası oluşturun:
```properties
# Windows için:
sdk.dir=C:\\Users\\USERNAME\\AppData\\Local\\Android\\Sdk

# Mac için:
sdk.dir=/Users/USERNAME/Library/Android/sdk

# Linux için:
sdk.dir=/home/USERNAME/Android/Sdk
```

### Hata 3: Gradle Sync Hatası
```
Could not resolve all dependencies
```
**Çözüm:**
1. **File > Invalidate Caches > Invalidate and Restart**
2. Gradle sync'i tekrar deneyin

### Hata 4: Metro Bundler Bağlantı Hatası
```
Unable to load script
```
**Çözüm:**
1. Emülatörde: `adb reverse tcp:8081 tcp:8081`
2. veya Metro'yu `--host=0.0.0.0` ile başlatın:
```bash
npx expo start --host 0.0.0.0
```

### Hata 5: JDK Versiyon Hatası
```
Unsupported class file major version
```
**Çözüm:** JDK 17 kullanın:
- **File > Project Structure > SDK Location > JDK Location**
- Android Studio'nun bundled JDK'sını seçin

---

## 📋 Build Komutları

### Debug APK Oluşturma
```bash
cd frontend/android
./gradlew assembleDebug
```
APK Yolu: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release APK Oluşturma
```bash
cd frontend/android
./gradlew assembleRelease
```

### Temiz Build
```bash
cd frontend/android
./gradlew clean
./gradlew assembleDebug
```

---

## 🔌 Bluetooth OBD-II Bağlantısı (Gerçek Cihaz)

⚠️ **ÖNEMLİ:** Bluetooth OBD-II bağlantısı sadece **fiziksel Android cihazda** çalışır. Emülatörde Bluetooth Classic desteklenmez.

### Fiziksel Cihazda Test
1. USB Debugging'i etkinleştirin
2. Cihazı USB ile bağlayın
3. `adb devices` komutu ile cihazı doğrulayın
4. Android Studio'da cihazınızı seçip çalıştırın

---

## 📁 Proje Yapısı

```
frontend/
├── android/              # Android native proje
│   ├── app/
│   │   └── build.gradle  # Uygulama build ayarları
│   ├── build.gradle      # Root build ayarları
│   └── gradle.properties # Gradle özellikleri
├── app/                  # React Native ekranları
│   ├── (tabs)/           # Tab navigasyonu
│   ├── auth.tsx          # Giriş/Kayıt ekranı
│   └── index.tsx         # Ana yönlendirme
├── contexts/             # React Context'ler
├── data/                 # Statik veriler
├── services/             # Servis katmanları
└── package.json          # Bağımlılıklar
```

---

## 📞 Destek

Hata alırsanız lütfen aşağıdaki bilgileri paylaşın:
1. Hata mesajının ekran görüntüsü
2. Android Studio versiyonu
3. Gradle sync log'u

---

**Hazır!** 🎉 Artık OBD-II Diagnostik uygulamanızı Android Studio'da derleyebilirsiniz.
