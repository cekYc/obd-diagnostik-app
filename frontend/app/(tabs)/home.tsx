import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Home() {
  const { theme } = useTheme();
  const { user, logout, refreshUser } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Çıkış Yap', 'Çıkış yapmak istediğinizden emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Çıkış', style: 'destructive', onPress: async () => { await logout(); router.replace('/auth'); }},
    ]);
  };

  return (
    <LinearGradient colors={[theme.colors.background, theme.colors.surface]} style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={[styles.userHeader, { backgroundColor: theme.colors.cardBg }]}>
          <View style={styles.userInfo}>
            <Text style={[styles.username, { color: theme.colors.text }]}>
              {user?.username || 'Kullanıcı'}
            </Text>
            <View style={styles.creditContainer}>
              <Ionicons name="wallet" size={16} color={theme.colors.success} />
              <Text style={[styles.creditText, { color: theme.colors.success }]}>
                {user?.credits || 0} Kredi
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color={theme.colors.error} />
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.cardBg }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Anasayfa</Text>
          <Text style={[styles.cardText, { color: theme.colors.textSecondary }]}>
            OBD-II Diagnostik uygulamasına hoş geldiniz!
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  userHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, margin: 16, borderRadius: 12 },
  userInfo: { flex: 1 },
  username: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  creditContainer: { flexDirection: 'row', alignItems: 'center' },
  creditText: { fontSize: 14, fontWeight: '600', marginLeft: 6 },
  logoutButton: { padding: 8 },
  card: { margin: 16, padding: 20, borderRadius: 16 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  cardText: { fontSize: 16 },
});
