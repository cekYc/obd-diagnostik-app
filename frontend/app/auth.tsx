import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
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

  const handleSubmit = async () => {
    if (!username || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }
    try {
      if (isLogin) {
        await login(username, password);
      } else {
        if (!email) {
          Alert.alert('Hata', 'E-posta gerekli');
          return;
        }
        await register(username, email, password);
      }
      router.replace('/(tabs)/home');
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Bir hata oluştu');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: theme.colors.text }]}>OBD-II Diagnostik</Text>
        
        <View style={styles.tabs}>
          <TouchableOpacity 
            style={[styles.tab, isLogin && { backgroundColor: theme.colors.primary }]} 
            onPress={() => setIsLogin(true)}
          >
            <Text style={styles.tabText}>Giriş</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, !isLogin && { backgroundColor: theme.colors.primary }]} 
            onPress={() => setIsLogin(false)}
          >
            <Text style={styles.tabText}>Kayıt</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.input, { backgroundColor: theme.colors.surface }]}>
          <TextInput 
            placeholder="Kullanıcı Adı" 
            value={username} 
            onChangeText={setUsername}
            style={{ color: theme.colors.text, padding: 4 }}
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>

        {!isLogin && (
          <View style={[styles.input, { backgroundColor: theme.colors.surface }]}>
            <TextInput 
              placeholder="E-posta" 
              value={email} 
              onChangeText={setEmail}
              style={{ color: theme.colors.text, padding: 4 }}
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="email-address"
            />
          </View>
        )}

        <View style={[styles.input, { backgroundColor: theme.colors.surface }]}>
          <TextInput 
            placeholder="Şifre" 
            value={password} 
            onChangeText={setPassword}
            secureTextEntry
            style={{ color: theme.colors.text, padding: 4 }}
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.colors.primary }]} 
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 24, justifyContent: 'center', flex: 1 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 32 },
  tabs: { flexDirection: 'row', marginBottom: 24, borderRadius: 8, overflow: 'hidden' },
  tab: { flex: 1, padding: 12, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)' },
  tabText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  input: { padding: 16, borderRadius: 8, marginBottom: 16 },
  button: { padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});
