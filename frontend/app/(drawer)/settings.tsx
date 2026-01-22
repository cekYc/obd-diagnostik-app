import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useOBD } from '../../contexts/OBDContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { deviceType, setDeviceType, connectionStatus } = useOBD();

  const isDarkSport = theme.type === 'dark-sport';

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleDeviceTypeChange = (type: 'bluetooth' | 'wifi') => {
    if (connectionStatus === 'connected') {
      Alert.alert(
        'Bağlantı Aktif',
        'Cihaz tipini değiştirmek için önce bağlantıyı kesin.',
        [{ text: 'Tamam' }]
      );
      return;
    }
    setDeviceType(type);
  };

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.surface]}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Tema</Text>
          
          <View style={[styles.card, { backgroundColor: theme.colors.cardBg }]}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="color-palette" size={24} color={theme.colors.primary} />
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                    {isDarkSport ? 'Dark Sport' : 'Green Metallic'}
                  </Text>
                  <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                    {isDarkSport ? 'Koyu spor tema' : 'Yeşil metalik tema'}
                  </Text>
                </View>
              </View>
              <Switch
                value={!isDarkSport}
                onValueChange={handleThemeToggle}
                trackColor={{ false: '#767577', true: theme.colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Theme Preview */}
          <View style={styles.themePreviewContainer}>
            <TouchableOpacity
              style={[
                styles.themePreview,
                { backgroundColor: '#1C1C1E' },
                isDarkSport && { borderColor: theme.colors.primary, borderWidth: 3 },
              ]}
              onPress={() => !isDarkSport && handleThemeToggle()}
            >
              <View style={[styles.themePreviewAccent, { backgroundColor: '#FF3B30' }]} />
              <Text style={styles.themePreviewText}>Dark Sport</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themePreview,
                { backgroundColor: '#152820' },
                !isDarkSport && { borderColor: theme.colors.primary, borderWidth: 3 },
              ]}
              onPress={() => isDarkSport && handleThemeToggle()}
            >
              <View style={[styles.themePreviewAccent, { backgroundColor: '#00FF88' }]} />
              <Text style={styles.themePreviewText}>Green Metallic</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Device Type Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            OBD Cihaz Tipi
          </Text>
          
          <View style={[styles.card, { backgroundColor: theme.colors.cardBg }]}>
            <TouchableOpacity
              style={[
                styles.deviceOption,
                deviceType === 'bluetooth' && { backgroundColor: theme.colors.surface },
              ]}
              onPress={() => handleDeviceTypeChange('bluetooth')}
            >
              <Ionicons
                name="bluetooth"
                size={28}
                color={deviceType === 'bluetooth' ? theme.colors.primary : theme.colors.textSecondary}
              />
              <View style={styles.deviceOptionText}>
                <Text
                  style={[
                    styles.deviceOptionTitle,
                    { color: deviceType === 'bluetooth' ? theme.colors.text : theme.colors.textSecondary },
                  ]}
                >
                  Bluetooth
                </Text>
                <Text style={[styles.deviceOptionDescription, { color: theme.colors.textSecondary }]}>
                  OBD-II cihazına Bluetooth ile bağlan
                </Text>
              </View>
              {deviceType === 'bluetooth' && (
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
              )}
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

            <TouchableOpacity
              style={[
                styles.deviceOption,
                deviceType === 'wifi' && { backgroundColor: theme.colors.surface },
              ]}
              onPress={() => handleDeviceTypeChange('wifi')}
            >
              <Ionicons
                name="wifi"
                size={28}
                color={deviceType === 'wifi' ? theme.colors.primary : theme.colors.textSecondary}
              />
              <View style={styles.deviceOptionText}>
                <Text
                  style={[
                    styles.deviceOptionTitle,
                    { color: deviceType === 'wifi' ? theme.colors.text : theme.colors.textSecondary },
                  ]}
                >
                  Wi-Fi
                </Text>
                <Text style={[styles.deviceOptionDescription, { color: theme.colors.textSecondary }]}>
                  OBD-II cihazına Wi-Fi ile bağlan
                </Text>
              </View>
              {deviceType === 'wifi' && (
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Connection Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Bağlantı Bilgisi</Text>
          
          <View style={[styles.card, { backgroundColor: theme.colors.cardBg }]}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Durum</Text>
              <View style={styles.infoValueContainer}>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor:
                        connectionStatus === 'connected'
                          ? theme.colors.success
                          : connectionStatus === 'connecting'
                          ? theme.colors.warning
                          : theme.colors.textSecondary,
                    },
                  ]}
                />
                <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                  {connectionStatus === 'connected'
                    ? 'Bağlı'
                    : connectionStatus === 'connecting'
                    ? 'Bağlanıyor...'
                    : 'Bağlı Değil'}
                </Text>
              </View>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Protokol</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                {connectionStatus === 'connected' ? 'ISO 15765-4 (CAN)' : '-'}
              </Text>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Hakkında</Text>
          
          <View style={[styles.card, { backgroundColor: theme.colors.cardBg }]}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Versiyon</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>1.0.0</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Dil</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>Türkçe</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
  themePreviewContainer: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  themePreview: {
    flex: 1,
    height: 100,
    borderRadius: 12,
    padding: 12,
    justifyContent: 'space-between',
  },
  themePreviewAccent: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  themePreviewText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deviceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  deviceOptionText: {
    flex: 1,
    marginLeft: 16,
  },
  deviceOptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  deviceOptionDescription: {
    fontSize: 13,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 15,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  infoValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
});
