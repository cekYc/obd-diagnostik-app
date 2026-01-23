import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert, Modal, TextInput } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Home() {
  const { theme } = useTheme();
  const { user, logout, refreshUser, token } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [giftUsername, setGiftUsername] = useState('');
  const [giftAmount, setGiftAmount] = useState('');
  const [giftLoading, setGiftLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const router = useRouter();

  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || '';

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

  const handleGiftCredits = async () => {
    if (!giftUsername || !giftAmount) {
      Alert.alert('Hata', 'Kullanıcı adı ve miktar gerekli');
      return;
    }

    const amount = parseInt(giftAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Hata', 'Geçerli bir miktar girin');
      return;
    }

    setGiftLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/credits/gift`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: giftUsername,
          amount: amount,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        Alert.alert('Başarılı', data.message);
        setShowGiftModal(false);
        setGiftUsername('');
        setGiftAmount('');
      } else {
        const error = await response.json();
        Alert.alert('Hata', error.detail || 'İşlem başarısız');
      }
    } catch (error) {
      Alert.alert('Hata', 'Bağlantı hatası');
    } finally {
      setGiftLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      Alert.alert('Hata', 'Eski ve yeni şifreyi girin');
      return;
    }

    if (newPassword.length < 4) {
      Alert.alert('Hata', 'Yeni şifre en az 4 karakter olmalıdır');
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        Alert.alert('Başarılı', data.message);
        setShowPasswordModal(false);
        setOldPassword('');
        setNewPassword('');
      } else {
        const error = await response.json();
        Alert.alert('Hata', error.detail || 'Şifre değiştirilemedi');
      }
    } catch (error) {
      Alert.alert('Hata', 'Bağlantı hatası');
    } finally {
      setPasswordLoading(false);
    }
  };

  const adminFeatures = [
    { icon: 'gift', label: 'Kredi Hediye Et', onPress: () => setShowGiftModal(true) },
    { icon: 'people', label: 'Kullanıcılar', onPress: () => Alert.alert('Yakında', 'Bu özellik yakında eklenecek') },
    { icon: 'stats-chart', label: 'İstatistikler', onPress: () => Alert.alert('Yakında', 'Bu özellik yakında eklenecek') },
    { icon: 'settings', label: 'Sistem Ayarları', onPress: () => Alert.alert('Yakında', 'Bu özellik yakında eklenecek') },
  ];

  const userFeatures = [
    { icon: 'car', label: 'Araç Seçimi', color: theme.colors.primary },
    { icon: 'build', label: 'Tanılama', color: theme.colors.accent },
    { icon: 'warning', label: 'Arıza Kodları', color: theme.colors.error },
    { icon: 'speedometer', label: 'Canlı Veri', color: theme.colors.success },
  ];

  const diagnosticModules = [
    { icon: 'flash', label: 'Gaz Kelebeği', cost: 50, unlocked: user?.is_admin },
    { icon: 'leaf', label: 'EGR Tanılama', cost: 50, unlocked: user?.is_admin },
    { icon: 'disc', label: 'ABS Tanılama', cost: 75, unlocked: user?.is_admin },
    { icon: 'compass', label: 'SAS Kalibrasyon', cost: 100, unlocked: user?.is_admin },
    { icon: 'hand-left', label: 'EPB Servisi', cost: 75, unlocked: user?.is_admin },
    { icon: 'construct', label: 'Fren Sıfırlama', cost: 50, unlocked: user?.is_admin },
    { icon: 'flame', label: 'DPF Rejenerasyon', cost: 100, unlocked: user?.is_admin },
    { icon: 'radio', label: 'TPMS Tanılama', cost: 50, unlocked: user?.is_admin },
    { icon: 'water', label: 'Yağ Servisi', cost: 25, unlocked: user?.is_admin },
  ];

  return (
    <LinearGradient colors={[theme.colors.background, theme.colors.surface]} style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
      >
        {/* User Header */}
        <View style={[styles.userHeader, { backgroundColor: theme.colors.cardBg }]}>
          <View style={styles.userInfo}>
            <View style={styles.userNameRow}>
              <Text style={[styles.username, { color: theme.colors.text }]}>
                {user?.username}
              </Text>
              {user?.is_admin && (
                <View style={[styles.adminBadge, { backgroundColor: theme.colors.accent }]}>
                  <Ionicons name="shield-checkmark" size={12} color="#FFF" />
                  <Text style={styles.adminBadgeText}>Admin</Text>
                </View>
              )}
            </View>
            <View style={styles.creditContainer}>
              <Ionicons name="wallet" size={16} color={theme.colors.success} />
              <Text style={[styles.creditText, { color: theme.colors.success }]}>
                {user?.is_admin ? '∞ Sınırsız' : `${user?.credits || 0}`} Kredi
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color={theme.colors.error} />
          </TouchableOpacity>
        </View>

        {/* Admin Panel */}
        {user?.is_admin && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.accent }]}>
              <Ionicons name="shield" size={20} /> Admin Paneli
            </Text>
            <View style={styles.grid}>
              {adminFeatures.map((feature, index) => (
                <TouchableOpacity 
                  key={index}
                  style={[styles.adminCard, { backgroundColor: theme.colors.accent + '20', borderColor: theme.colors.accent }]}
                  onPress={feature.onPress}
                >
                  <Ionicons name={feature.icon as any} size={28} color={theme.colors.accent} />
                  <Text style={[styles.cardLabel, { color: theme.colors.text }]}>{feature.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Quick Access */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Hızlı Erişim</Text>
          <View style={styles.grid}>
            {userFeatures.map((feature, index) => (
              <TouchableOpacity 
                key={index}
                style={[styles.featureCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}
              >
                <View style={[styles.iconBg, { backgroundColor: feature.color + '20' }]}>
                  <Ionicons name={feature.icon as any} size={28} color={feature.color} />
                </View>
                <Text style={[styles.cardLabel, { color: theme.colors.text }]}>{feature.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Diagnostic Modules */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Tanılama Modülleri</Text>
          <View style={styles.moduleGrid}>
            {diagnosticModules.map((module, index) => (
              <TouchableOpacity 
                key={index}
                style={[
                  styles.moduleCard, 
                  { 
                    backgroundColor: module.unlocked ? theme.colors.success + '20' : theme.colors.cardBg,
                    borderColor: module.unlocked ? theme.colors.success : theme.colors.border 
                  }
                ]}
              >
                <Ionicons 
                  name={module.icon as any} 
                  size={24} 
                  color={module.unlocked ? theme.colors.success : theme.colors.textSecondary} 
                />
                <Text style={[styles.moduleLabel, { color: theme.colors.text }]}>{module.label}</Text>
                {module.unlocked ? (
                  <View style={[styles.unlockedBadge, { backgroundColor: theme.colors.success }]}>
                    <Ionicons name="checkmark" size={12} color="#FFF" />
                    <Text style={styles.unlockedText}>Aktif</Text>
                  </View>
                ) : (
                  <Text style={[styles.moduleCost, { color: theme.colors.primary }]}>{module.cost} Kredi</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Connection Status */}
        <View style={[styles.statusCard, { backgroundColor: theme.colors.cardBg }]}>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: theme.colors.error }]} />
            <Text style={[styles.statusText, { color: theme.colors.textSecondary }]}>
              OBD-II Bağlantısı: Bağlı Değil
            </Text>
          </View>
          <TouchableOpacity style={[styles.connectButton, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="bluetooth" size={18} color="#FFF" />
            <Text style={styles.connectButtonText}>Cihaz Bağla</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Gift Credits Modal */}
      <Modal
        visible={showGiftModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGiftModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.cardBg }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Kredi Hediye Et</Text>
              <TouchableOpacity onPress={() => setShowGiftModal(false)}>
                <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Ionicons name="person-outline" size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="Kullanıcı Adı"
                placeholderTextColor={theme.colors.textSecondary}
                value={giftUsername}
                onChangeText={setGiftUsername}
                autoCapitalize="none"
              />
            </View>

            <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Ionicons name="wallet-outline" size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="Kredi Miktarı"
                placeholderTextColor={theme.colors.textSecondary}
                value={giftAmount}
                onChangeText={setGiftAmount}
                keyboardType="number-pad"
              />
            </View>

            <TouchableOpacity
              style={[styles.giftButton, { backgroundColor: theme.colors.accent }]}
              onPress={handleGiftCredits}
              disabled={giftLoading}
            >
              <Ionicons name="gift" size={20} color="#FFF" />
              <Text style={styles.giftButtonText}>
                {giftLoading ? 'Gönderiliyor...' : 'Kredi Gönder'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  userHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 16, 
    marginHorizontal: 16, 
    marginTop: 16, 
    borderRadius: 12, 
    elevation: 3,
  },
  userInfo: { flex: 1 },
  userNameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  username: { fontSize: 18, fontWeight: 'bold' },
  adminBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    borderRadius: 12, 
    marginLeft: 8 
  },
  adminBadgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold', marginLeft: 4 },
  creditContainer: { flexDirection: 'row', alignItems: 'center' },
  creditText: { fontSize: 14, fontWeight: '600', marginLeft: 6 },
  logoutButton: { padding: 8 },
  section: { marginTop: 24, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
  adminCard: { 
    width: '46%', 
    margin: '2%', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    borderWidth: 1 
  },
  featureCard: { 
    width: '46%', 
    margin: '2%', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    borderWidth: 1 
  },
  iconBg: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  cardLabel: { fontSize: 12, fontWeight: '600', textAlign: 'center', marginTop: 4 },
  moduleGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 },
  moduleCard: { 
    width: '31%', 
    margin: '1%', 
    padding: 12, 
    borderRadius: 10, 
    alignItems: 'center', 
    borderWidth: 1 
  },
  moduleLabel: { fontSize: 10, fontWeight: '600', textAlign: 'center', marginTop: 4 },
  moduleCost: { fontSize: 10, fontWeight: 'bold', marginTop: 4 },
  unlockedBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 6, 
    paddingVertical: 2, 
    borderRadius: 8, 
    marginTop: 4 
  },
  unlockedText: { color: '#FFF', fontSize: 8, fontWeight: 'bold', marginLeft: 2 },
  statusCard: { 
    margin: 16, 
    padding: 16, 
    borderRadius: 12, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  statusText: { fontSize: 12 },
  connectButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 8 
  },
  connectButtonText: { color: '#FFF', fontSize: 12, fontWeight: '600', marginLeft: 6 },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalContent: { 
    width: '85%', 
    padding: 20, 
    borderRadius: 16 
  },
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    borderRadius: 12, 
    borderWidth: 1, 
    marginBottom: 16 
  },
  input: { flex: 1, marginLeft: 12, fontSize: 16 },
  giftButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 14, 
    borderRadius: 12 
  },
  giftButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
});
