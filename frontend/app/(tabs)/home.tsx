import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';

export default function Home() {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Çıkış', 'Çıkış yapmak istediğiniz emin misiniz?', [
      { text: 'Hayır' },
      { text: 'Evet', onPress: async () => { await logout(); router.replace('/auth'); }},
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.username, { color: theme.colors.text }]}>
          {user?.username}
        </Text>
        <Text style={[styles.credits, { color: theme.colors.success }]}>
          {user?.credits} Kredi
        </Text>
      </View>
      <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary }]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { padding: 20, borderRadius: 12, marginBottom: 20 },
  username: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  credits: { fontSize: 16, fontWeight: '600' },
  button: { padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});
