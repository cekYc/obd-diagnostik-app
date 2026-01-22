import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Home() {
  const { theme } = useTheme();
  const { user, logout, refreshUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshUser();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleLogout = () => {
    Alert.alert('Çıkış Yap', 'Çıkış yapmak istediğinizden emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Çıkış Yap', style: 'destructive', onPress: async () => { await logout(); router.replace('/auth'); }},
    ]);
  };

  return (
    <LinearGradient colors={[theme.colors.background, theme.colors.surface]} style={styles.container}>
      <ScrollView style={styles.scrollView} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}>
        <View style={[styles.userHeader, { backgroundColor: theme.colors.cardBg }]}>
          <View style={styles.userInfo}>
            <Text style={[styles.username, { color: theme.colors.text }]}>
              {user?.username}
              {user?.is_admin && <Text style={[styles.adminBadge, { color: theme.colors.accent }]}> [Admin]</Text>}
            </Text>
            <View style={styles.creditContainer}>
              <Ionicons name="wallet" size={16} color={theme.colors.success} />
              <Text style={[styles.creditText, { color: theme.colors.success }]}>{user?.credits || 0} Kredi</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color={theme.colors.error} />
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.cardBg }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="speedometer" size={24} color={theme.colors.primary} />
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Dashboard</Text>
          </View>
          <Text style={[styles.cardText, { color: theme.colors.textSecondary }]}>OBD-II Diagnostik Sistemi</Text>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Hızlı Erişim</Text>
        <View style={styles.quickAccessGrid}>
          <QuickAccessCard icon="car" label="Araç Seçimi" theme={theme} />
          <QuickAccessCard icon="build" label="Tanılama" theme={theme} />
          <QuickAccessCard icon="settings" label="Ayarlar" theme={theme} />
          <QuickAccessCard icon="stats-chart" label="İstatistikler" theme={theme} />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const QuickAccessCard = ({ icon, label, theme }: any) => (
  <View style={[styles.quickCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
    <Ionicons name={icon} size={32} color={theme.colors.primary} />
    <Text style={[styles.quickLabel, { color: theme.colors.text }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  userHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, marginHorizontal: 16, marginTop: 16, borderRadius: 12, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 },
  userInfo: { flex: 1 },
  username: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  adminBadge: { fontSize: 14, fontWeight: '600' },
  creditContainer: { flexDirection: 'row', alignItems: 'center' },
  creditText: { fontSize: 14, fontWeight: '600', marginLeft: 6 },
  logoutButton: { padding: 8 },
  card: { margin: 16, padding: 20, borderRadius: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 12 },
  cardText: { fontSize: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginHorizontal: 16, marginTop: 8, marginBottom: 16 },
  quickAccessGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8 },
  quickCard: { width: '45%', margin: 8, padding: 16, borderRadius: 12, borderWidth: 1, alignItems: 'center', elevation: 2 },
  quickLabel: { fontSize: 12, marginTop: 8, textAlign: 'center', fontWeight: '600' },
});