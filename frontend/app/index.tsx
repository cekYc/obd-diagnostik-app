import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function Index() {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.surface]}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo/Icon */}
        <View style={[styles.logoContainer, { borderColor: theme.colors.primary }]}>
          <Ionicons name="car-sport" size={80} color={theme.colors.primary} />
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: theme.colors.text }]}>
          OBD-II Diagnostik
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Profesyonel Araç Tanılama Sistemi
        </Text>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <FeatureItem
            icon="bluetooth"
            text="Bluetooth & Wi-Fi Desteği"
            theme={theme}
          />
          <FeatureItem
            icon="speedometer"
            text="Canlı Veri İzleme"
            theme={theme}
          />
          <FeatureItem
            icon="warning"
            text="Hata Kodu Okuma"
            theme={theme}
          />
          <FeatureItem
            icon="build"
            text="Gelişmiş Tanılama"
            theme={theme}
          />
        </View>

        {/* Start Button */}
        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => router.push('/(drawer)/dashboard')}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>Başlat</Text>
          <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const FeatureItem = ({ icon, text, theme }: any) => (
  <View style={styles.featureItem}>
    <Ionicons name={icon} size={24} color={theme.colors.accent} />
    <Text style={[styles.featureText, { color: theme.colors.text }]}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 48,
    textAlign: 'center',
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 48,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  featureText: {
    fontSize: 16,
    marginLeft: 16,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 12,
  },
});
