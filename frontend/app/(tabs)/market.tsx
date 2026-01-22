import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

export default function Market() {
  const { theme } = useTheme();

  return (
    <LinearGradient colors={[theme.colors.background, theme.colors.surface]} style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={[styles.header, { backgroundColor: theme.colors.cardBg }]}>
          <Ionicons name="cart" size={40} color={theme.colors.primary} />
          <Text style={[styles.title, { color: theme.colors.text }]}>Market</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Modüller ve Kredi Paketleri</Text>
        </View>

        <View style={[styles.comingSoon, { backgroundColor: theme.colors.cardBg }]}>
          <Ionicons name="construct" size={48} color={theme.colors.accent} />
          <Text style={[styles.comingSoonTitle, { color: theme.colors.text }]}>Yakında!</Text>
          <Text style={[styles.comingSoonText, { color: theme.colors.textSecondary }]}>Modül satın alma, kredi paketleri ve reklam sistemi yakında eklenecek.</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  header: { margin: 16, padding: 24, borderRadius: 16, alignItems: 'center', elevation: 3 },
  title: { fontSize: 28, fontWeight: 'bold', marginTop: 12 },
  subtitle: { fontSize: 14, marginTop: 4 },
  comingSoon: { margin: 16, padding: 32, borderRadius: 16, alignItems: 'center', elevation: 2 },
  comingSoonTitle: { fontSize: 24, fontWeight: 'bold', marginTop: 16 },
  comingSoonText: { fontSize: 16, marginTop: 8, textAlign: 'center' },
});