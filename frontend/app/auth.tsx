import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

export default function AuthScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username || !password || (!isLogin && !email)) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        await login(username, password);
        router.replace('/(tabs)/home');
      } else {
        await register(username, email, password);
        router.replace('/(tabs)/home');
      }
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[theme.colors.background, theme.colors.surface]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.logoContainer, { borderColor: theme.colors.primary }]}>
          <Ionicons name="car-sport" size={60} color={theme.colors.primary} />
        </View>
        <Text style={[styles.title, { color: theme.colors.text }]}>OBD-II Diagnostik</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tab, isLogin && { backgroundColor: theme.colors.primary }]} onPress={() => setIsLogin(true)}>
            <Text style={styles.tabText}>Giriş</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, !isLogin && { backgroundColor: theme.colors.primary }]} onPress={() => setIsLogin(false)}>
            <Text style={styles.tabText}>Kayıt</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.inputContainer, { backgroundColor: theme.colors.cardBg }]}>
          <TextInput style={[styles.input, { color: theme.colors.text }]} placeholder="Kullanıcı Adı" value={username} onChangeText={setUsername} />
        </View>
        {!isLogin && (
          <View style={[styles.inputContainer, { backgroundColor: theme.colors.cardBg }]}>
            <TextInput style={[styles.input, { color: theme.colors.text }]} placeholder="E-posta" value={email} onChangeText={setEmail} />
          </View>
        )}
        <View style={[styles.inputContainer, { backgroundColor: theme.colors.cardBg }]}>
          <TextInput style={[styles.input, { color: theme.colors.text }]} placeholder="Şifre" value={password} onChangeText={setPassword} secureTextEntry />
        </View>
        <TouchableOpacity style={[styles.submitButton, { backgroundColor: theme.colors.primary }]} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>{loading ? 'Bekleyin...' : isLogin ? 'Giriş' : 'Kayıt'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24, justifyContent: 'center', flex: 1 },
  logoContainer: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  tabContainer: { flexDirection: 'row', marginBottom: 24, borderRadius: 12, overflow: 'hidden' },
  tab: { flex: 1, padding: 12, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)' },
  tabText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  inputContainer: { padding: 16, borderRadius: 12, marginBottom: 16 },
  input: { fontSize: 16 },
  submitButton: { padding: 16, borderRadius: 12, alignItems: 'center' },
  submitButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});
