import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useOBD } from '../../contexts/OBDContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Home() {
  const { theme } = useTheme();
  const { user, logout, refreshUser } = useAuth();
  const { connectionStatus, obdData, selectedVehicle, connectDevice } = useOBD();
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshUser();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleConnect = async () => {
    await connectDevice();
  };

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Çıkış yapmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/auth');
          },
        },
      ]
    );
  };

  return (
    <LinearGradient colors={[theme.colors.background, theme.colors.surface]} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
      >
        {/* User Header */}
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

        {/* Connection Status */}
        <View style={[styles.card, { backgroundColor: theme.colors.cardBg }]}>
          <View style={styles.cardHeader}>
            <Ionicons
              name={connectionStatus === 'connected' ? 'checkmark-circle' : 'radio-button-off'}
              size={24}
              color={connectionStatus === 'connected' ? theme.colors.success : theme.colors.textSecondary}
            />
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Bağlantı Durumu</Text>
          </View>
          <Text style={[styles.statusText, { color: theme.colors.textSecondary }]}>
            {connectionStatus === 'connected' ? 'Bağlı' : connectionStatus === 'connecting' ? 'Bağlanıyor...' : 'Bağlı Değil'}
          </Text>
          {connectionStatus !== 'connected' && (
            <TouchableOpacity style={[styles.connectButton, { backgroundColor: theme.colors.primary }]} onPress={handleConnect}>
              <Text style={styles.connectButtonText}>Bağlan</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Vehicle Info */}
        {selectedVehicle && (
          <View style={[styles.card, { backgroundColor: theme.colors.cardBg }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="car" size={24} color={theme.colors.accent} />
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Araç Bilgisi</Text>
            </View>
            <View style={styles.vehicleInfo}>
              <Text style={[styles.vehicleText, { color: theme.colors.text }]}>{selectedVehicle.brand} {selectedVehicle.model}</Text>
              <Text style={[styles.vehicleSubtext, { color: theme.colors.textSecondary }]}>{selectedVehicle.year} - {selectedVehicle.engine}</Text>
            </View>
          </View>
        )}

        {/* Live Data */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Canlı Veriler</Text>
        <View style={styles.dataGrid}>
          <DataCard icon="speedometer" label="Devir" value={obdData.rpm.toString()} unit="rpm" theme={theme} />
          <DataCard icon="rocket" label="Hız" value={obdData.speed.toString()} unit="km/h" theme={theme} />
          <DataCard icon="analytics" label="Motor Yükü" value={obdData.engineLoad.toString()} unit="%" theme={theme} />
          <DataCard icon="thermometer" label="Soğutma" value={obdData.coolantTemp.toString()} unit="°C" theme={theme} />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const DataCard = ({ icon, label, value, unit, theme }: any) => (
  <View style={[styles.dataCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
    <Ionicons name={icon} size={32} color={theme.colors.primary} />
    <Text style={[styles.dataLabel, { color: theme.colors.textSecondary }]}>{label}</Text>
    <View style={styles.dataValueContainer}>
      <Text style={[styles.dataValue, { color: theme.colors.text }]}>{value}</Text>
      <Text style={[styles.dataUnit, { color: theme.colors.textSecondary }]}>{unit}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  userHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, marginHorizontal: 16, marginTop: 16, borderRadius: 12 },
  userInfo: { flex: 1 },
  username: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  adminBadge: { fontSize: 14, fontWeight: '600' },
  creditContainer: { flexDirection: 'row', alignItems: 'center' },
  creditText: { fontSize: 14, fontWeight: '600', marginLeft: 6 },
  logoutButton: { padding: 8 },
  card: { margin: 16, padding: 20, borderRadius: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 12 },
  statusText: { fontSize: 16, marginTop: 8 },
  connectButton: { marginTop: 16, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  connectButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  vehicleInfo: { marginTop: 8 },
  vehicleText: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  vehicleSubtext: { fontSize: 14 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginHorizontal: 16, marginTop: 8, marginBottom: 16 },
  dataGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8 },
  dataCard: { width: '45%', margin: 8, padding: 16, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  dataLabel: { fontSize: 12, marginTop: 8, textAlign: 'center' },
  dataValueContainer: { flexDirection: 'row', alignItems: 'baseline', marginTop: 8 },
  dataValue: { fontSize: 28, fontWeight: 'bold' },
  dataUnit: { fontSize: 14, marginLeft: 4 },
});
