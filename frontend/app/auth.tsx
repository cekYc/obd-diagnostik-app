import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

type AuthStep = 'login' | 'register' | 'forgot_password' | 'verify_email' | 'reset_password';

export default function AuthScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { login, register } = useAuth();
  
  const [step, setStep] = useState<AuthStep>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || '';

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setVerificationCode('');
    setNewPassword('');
  };

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Hata', 'Kullanıcı adı ve şifre gereklidir');
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
      Alert.alert('Başarılı', 'Giriş başarılı!', [
        { text: 'Tamam', onPress: () => router.replace('/(tabs)/home') }
      ]);
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Kullanıcı adı veya şifre hatalı');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert('Hata', 'Tüm alanları doldurun');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır');
      return;
    }

    setLoading(true);
    try {
      // First send verification code
      const response = await fetch(`${BACKEND_URL}/api/auth/send-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setPendingEmail(email);
        const debugNote = data?.debug_code ? `\nKod (debug): ${data.debug_code}` : '';
        Alert.alert('Başarılı', `E-posta adresinize doğrulama kodu gönderildi${debugNote}`, [
          { text: 'Tamam', onPress: () => setStep('verify_email') }
        ]);
      } else {
        Alert.alert('Hata', data.detail || 'Bir hata oluştu');
      }
    } catch (error: any) {
      Alert.alert('Hata', 'Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!verificationCode) {
      Alert.alert('Hata', 'Doğrulama kodunu girin');
      return;
    }

    setLoading(true);
    try {
      const verifyResponse = await fetch(`${BACKEND_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmail, code: verificationCode }),
      });

      if (!verifyResponse.ok) {
        const error = await verifyResponse.json();
        Alert.alert('Hata', error.detail || 'Doğrulama kodu hatalı');
        return;
      }

      // Now complete registration
      await register(username, pendingEmail, password);
      Alert.alert('Başarılı', 'Kayıt tamamlandı! Hoş geldiniz!', [
        { text: 'Tamam', onPress: () => router.replace('/(tabs)/home') }
      ]);
    } catch (error: any) {
      if (error.message && error.message.includes('{')) {
        try {
          const errorData = JSON.parse(error.message);
          if (errorData.suggestions) {
            Alert.alert(
              errorData.message || 'Bu kullanıcı adı alınmış',
              `Alternatif öneriler:\n${errorData.suggestions.join('\n')}`
            );
            setStep('register');
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

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Hata', 'E-posta adresinizi girin');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setPendingEmail(email);
        const debugNote = data?.debug_code ? `\nKod (debug): ${data.debug_code}` : '';
        Alert.alert('Başarılı', `Doğrulama kodu e-posta adresinize gönderildi${debugNote}`, [
          { text: 'Tamam', onPress: () => setStep('reset_password') }
        ]);
      } else {
        Alert.alert('Hata', 'Bir hata oluştu');
      }
    } catch (error) {
      Alert.alert('Hata', 'Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!verificationCode || !newPassword) {
      Alert.alert('Hata', 'Tüm alanları doldurun');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: pendingEmail,
          code: verificationCode,
          new_password: newPassword,
        }),
      });

      if (response.ok) {
        Alert.alert('Başarılı', 'Şifreniz değiştirildi. Giriş yapabilirsiniz.', [
          { text: 'Tamam', onPress: () => { resetForm(); setStep('login'); } }
        ]);
      } else {
        const error = await response.json();
        Alert.alert('Hata', error.detail || 'Doğrulama kodu hatalı');
      }
    } catch (error) {
      Alert.alert('Hata', 'Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  const renderLoginForm = () => (
    <>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, styles.activeTab, { backgroundColor: theme.colors.primary }]}
          onPress={() => setStep('login')}
        >
          <Text style={[styles.tabText, styles.activeTabText]}>Giriş Yap</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, { backgroundColor: 'rgba(255,255,255,0.1)' }]}
          onPress={() => { resetForm(); setStep('register'); }}
        >
          <Text style={[styles.tabText, { color: theme.colors.textSecondary }]}>Kayıt Ol</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
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

        <View style={[styles.inputContainer, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
          <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            placeholder="Şifre"
            placeholderTextColor={theme.colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => { resetForm(); setStep('forgot_password'); }}>
          <Text style={[styles.forgotPassword, { color: theme.colors.primary }]}>Şifremi Unuttum</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </Text>
        </TouchableOpacity>

      </View>
    </>
  );

  const renderRegisterForm = () => (
    <>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, { backgroundColor: 'rgba(255,255,255,0.1)' }]}
          onPress={() => { resetForm(); setStep('login'); }}
        >
          <Text style={[styles.tabText, { color: theme.colors.textSecondary }]}>Giriş Yap</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, styles.activeTab, { backgroundColor: theme.colors.primary }]}
          onPress={() => setStep('register')}
        >
          <Text style={[styles.tabText, styles.activeTabText]}>Kayıt Ol</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
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

        <View style={[styles.inputContainer, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
          <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            placeholder="Şifre"
            placeholderTextColor={theme.colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.inputContainer, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
          <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            placeholder="Şifre Tekrar"
            placeholderTextColor={theme.colors.textSecondary}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
          </Text>
        </TouchableOpacity>

        <View style={[styles.bonusInfo, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="gift" size={20} color={theme.colors.success} />
          <Text style={[styles.bonusText, { color: theme.colors.text }]}>
            Kayıt bonusu: 100 kredi hediye!
          </Text>
        </View>
      </View>
    </>
  );

  const renderForgotPasswordForm = () => (
    <View style={styles.formContainer}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => { resetForm(); setStep('login'); }}
      >
        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        <Text style={[styles.backText, { color: theme.colors.text }]}>Geri</Text>
      </TouchableOpacity>

      <Text style={[styles.formTitle, { color: theme.colors.text }]}>Şifremi Unuttum</Text>
      <Text style={[styles.formSubtitle, { color: theme.colors.textSecondary }]}>
        E-posta adresinizi girin, size doğrulama kodu gönderelim.
      </Text>

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

      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleForgotPassword}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Gönderiliyor...' : 'Doğrulama Kodu Gönder'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderVerifyEmailForm = () => (
    <View style={styles.formContainer}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => { setStep('register'); }}
      >
        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        <Text style={[styles.backText, { color: theme.colors.text }]}>Geri</Text>
      </TouchableOpacity>

      <Text style={[styles.formTitle, { color: theme.colors.text }]}>E-posta Doğrulama</Text>
      <Text style={[styles.formSubtitle, { color: theme.colors.textSecondary }]}>
        {pendingEmail} adresine gönderilen kodu girin.
      </Text>

      <View style={[styles.inputContainer, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
        <Ionicons name="keypad-outline" size={20} color={theme.colors.textSecondary} />
        <TextInput
          style={[styles.input, { color: theme.colors.text, textAlign: 'center', fontSize: 24, letterSpacing: 8 }]}
          placeholder="000000"
          placeholderTextColor={theme.colors.textSecondary}
          value={verificationCode}
          onChangeText={setVerificationCode}
          keyboardType="number-pad"
          maxLength={6}
        />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleVerifyEmail}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Doğrulanıyor...' : 'Doğrula ve Kayıt Ol'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderResetPasswordForm = () => (
    <View style={styles.formContainer}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => { resetForm(); setStep('login'); }}
      >
        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        <Text style={[styles.backText, { color: theme.colors.text }]}>Geri</Text>
      </TouchableOpacity>

      <Text style={[styles.formTitle, { color: theme.colors.text }]}>Şifre Sıfırla</Text>
      <Text style={[styles.formSubtitle, { color: theme.colors.textSecondary }]}>
        {pendingEmail} adresine gönderilen kodu ve yeni şifrenizi girin.
      </Text>

      <View style={[styles.inputContainer, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
        <Ionicons name="keypad-outline" size={20} color={theme.colors.textSecondary} />
        <TextInput
          style={[styles.input, { color: theme.colors.text, textAlign: 'center', fontSize: 24, letterSpacing: 8 }]}
          placeholder="000000"
          placeholderTextColor={theme.colors.textSecondary}
          value={verificationCode}
          onChangeText={setVerificationCode}
          keyboardType="number-pad"
          maxLength={6}
        />
      </View>

      <View style={[styles.inputContainer, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
        <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textSecondary} />
        <TextInput
          style={[styles.input, { color: theme.colors.text }]}
          placeholder="Yeni Şifre"
          placeholderTextColor={theme.colors.textSecondary}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleResetPassword}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Şifre değiştiriliyor...' : 'Şifreyi Değiştir'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={[theme.colors.background, theme.colors.surface]} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={[styles.logoContainer, { borderColor: theme.colors.primary }]}>
            <Ionicons name="car-sport" size={60} color={theme.colors.primary} />
          </View>

          <Text style={[styles.title, { color: theme.colors.text }]}>OBD-II Diagnostik</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Profesyonel Araç Tanılama</Text>

          {step === 'login' && renderLoginForm()}
          {step === 'register' && renderRegisterForm()}
          {step === 'forgot_password' && renderForgotPasswordForm()}
          {step === 'verify_email' && renderVerifyEmailForm()}
          {step === 'reset_password' && renderResetPasswordForm()}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 },
  logoContainer: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 32 },
  tabContainer: { flexDirection: 'row', marginBottom: 32, borderRadius: 12, overflow: 'hidden' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  activeTab: { elevation: 3 },
  tabText: { fontSize: 16, fontWeight: '600' },
  activeTabText: { color: '#FFFFFF' },
  formContainer: { marginBottom: 24 },
  formTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, marginTop: 16 },
  formSubtitle: { fontSize: 14, marginBottom: 24 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  input: { flex: 1, marginLeft: 12, fontSize: 16 },
  submitButton: { paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 8, elevation: 3 },
  submitButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  bonusInfo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 8, marginTop: 16 },
  bonusText: { fontSize: 14, marginLeft: 8, fontWeight: '600' },
  forgotPassword: { textAlign: 'right', marginBottom: 16, fontWeight: '600' },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  backText: { marginLeft: 8, fontSize: 16, fontWeight: '600' },
});
