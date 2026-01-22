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
        router.replace('/(drawer)/dashboard');
      } else {
        await register(username, email, password);
        router.replace('/(drawer)/dashboard');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      // Handle username suggestions
      if (error.message && error.message.includes('{')) {
        try {
          const errorData = JSON.parse(error.message);
          if (errorData.suggestions) {
            Alert.alert(
              errorData.message || 'Bu kullanıcı adı alınmış',
              `Alternatif öneriler:\n${errorData.suggestions.join('\n')}`,
              [{ text: 'Tamam' }]
            );
            return;
          }
          Alert.alert('Hata', errorData.message || 'Bir hata oluştu');
        } catch {
          Alert.alert('Hata', error.message);
        }
      } else {
        Alert.alert('Hata', error.message || 'Bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.surface]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={[styles.logoContainer, { borderColor: theme.colors.primary }]}>
            <Ionicons name="car-sport" size={60} color={theme.colors.primary} />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: theme.colors.text }]}>
            OBD-II Diagnostik
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Profesyonel Araç Tanılama
          </Text>

          {/* Tab Switcher */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                isLogin && [styles.activeTab, { backgroundColor: theme.colors.primary }],
              ]}
              onPress={() => setIsLogin(true)}
            >
              <Text style={[styles.tabText, isLogin && styles.activeTabText]}>
                Giriş Yap
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                !isLogin && [styles.activeTab, { backgroundColor: theme.colors.primary }],
              ]}
              onPress={() => setIsLogin(false)}
            >
              <Text style={[styles.tabText, !isLogin && styles.activeTabText]}>
                Kayıt Ol
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Username */}
            <View style={[styles.inputContainer, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
              <Ionicons name="person-outline" size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="Kullanıcı Adı"
                placeholderTextColor={theme.colors.textSecondary}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Email (for registration) */}
            {!isLogin && (
              <View style={[styles.inputContainer, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
                <Ionicons name="mail-outline" size={20} color={theme.colors.textSecondary} />
                <TextInput
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="E-posta"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoCorrect={false}
                />
              </View>
            )}

            {/* Password */}
            <View style={[styles.inputContainer, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
              <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="Şifre"
                placeholderTextColor={theme.colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Lütfen bekleyin...' : isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
              </Text>
            </TouchableOpacity>

            {/* Welcome Bonus Info */}
            {!isLogin && (
              <View style={[styles.bonusInfo, { backgroundColor: theme.colors.surface }]}>
                <Ionicons name="gift" size={20} color={theme.colors.success} />
                <Text style={[styles.bonusText, { color: theme.colors.text }]}>
                  Kayıt bonusu: 100 kredi hediye!
                </Text>
              </View>
            )}
          </View>

          {/* Test Admin Info */}
          <View style={[styles.adminInfo, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={[styles.adminTitle, { color: theme.colors.accent }]}>
              Test İçin
            </Text>
            <Text style={[styles.adminText, { color: theme.colors.textSecondary }]}>
              Admin: admin / Kc2818.
            </Text>
            <Text style={[styles.adminSubtext, { color: theme.colors.textSecondary }]}>
              (Sınırsız kredi + tüm modüller)
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 32,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  activeTab: {
    elevation: 3,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  formContainer: {
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    elevation: 3,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bonusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  bonusText: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '600',
  },
  adminInfo: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  adminTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  adminText: {
    fontSize: 14,
    marginBottom: 4,
  },
  adminSubtext: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});
