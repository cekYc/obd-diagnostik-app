import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useOBD } from '../../contexts/OBDContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getDTCDescription } from '../../data/dtcDatabase';

export default function Diagnostics() {
  const { theme } = useTheme();
  const { connectionStatus, dtcCodes, readDTC, clearDTC } = useOBD();
  const [activeTab, setActiveTab] = useState<'dtc' | 'advanced'>('dtc');

  const handleReadDTC = async () => {
    if (connectionStatus !== 'connected') {
      Alert.alert('Bağlantı Hatası', 'Lütfen önce OBD cihazınıza bağlanın.');
      return;
    }
    await readDTC();
  };

  const handleClearDTC = async () => {
    if (connectionStatus !== 'connected') {
      Alert.alert('Bağlantı Hatası', 'Lütfen önce OBD cihazınıza bağlanın.');
      return;
    }
    Alert.alert(
      'Hata Kodlarını Sil',
      'Tüm hata kodlarını silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            await clearDTC();
            Alert.alert('Başarılı', 'Hata kodları temizlendi.');
          },
        },
      ]
    );
  };

  const handleAdvancedDiagnostic = (module: string) => {
    if (connectionStatus !== 'connected') {
      Alert.alert('Bağlantı Hatası', 'Lütfen önce OBD cihazınıza bağlanın.');
      return;
    }
    Alert.alert(
      module,
      'Bu modül, araç tarafından destekleniyorsa çalıştırılacaktır. Gerçek bir OBD-II cihazı bağlı olduğunda etkin olur.',
      [{ text: 'Tamam' }]
    );
  };

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.surface]}
      style={styles.container}
    >
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'dtc' && { borderBottomColor: theme.colors.primary },
          ]}
          onPress={() => setActiveTab('dtc')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'dtc' ? theme.colors.text : theme.colors.textSecondary },
            ]}
          >
            Hata Kodları (DTC)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'advanced' && { borderBottomColor: theme.colors.primary },
          ]}
          onPress={() => setActiveTab('advanced')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'advanced' ? theme.colors.text : theme.colors.textSecondary },
            ]}
          >
            Gelişmiş Tanılama
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {activeTab === 'dtc' ? (
          <View style={styles.dtcContainer}>
            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleReadDTC}
              >
                <Ionicons name="search" size={24} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Hata Kodlarını Oku</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
                onPress={handleClearDTC}
              >
                <Ionicons name="trash" size={24} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Hata Kodlarını Sil</Text>
              </TouchableOpacity>
            </View>

            {/* DTC List */}
            {dtcCodes.length > 0 ? (
              dtcCodes.map((dtc, index) => {
                const dtcInfo = getDTCDescription(dtc.code);
                return (
                  <View
                    key={index}
                    style={[styles.dtcCard, { backgroundColor: theme.colors.cardBg }]}
                  >
                    <View style={styles.dtcHeader}>
                      <Ionicons name="warning" size={24} color={theme.colors.warning} />
                      <Text style={[styles.dtcCode, { color: theme.colors.text }]}>
                        {dtc.code}
                      </Text>
                    </View>
                    <Text style={[styles.dtcDescription, { color: theme.colors.text }]}>
                      {dtcInfo?.turkishDescription || dtc.description}
                    </Text>
                    {dtcInfo && (
                      <Text style={[styles.dtcDescriptionEn, { color: theme.colors.textSecondary }]}>
                        {dtcInfo.description}
                      </Text>
                    )}
                  </View>
                );
              })
            ) : (
              <View style={[styles.emptyState, { backgroundColor: theme.colors.cardBg }]}>
                <Ionicons name="checkmark-circle" size={64} color={theme.colors.success} />
                <Text style={[styles.emptyStateText, { color: theme.colors.text }]}>
                  Hata kodu bulunamadı
                </Text>
                <Text style={[styles.emptyStateSubtext, { color: theme.colors.textSecondary }]}>
                  Hata kodlarını okumak için yukarıdaki butonu kullanın
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.advancedContainer}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Gelişmiş Tanılama Modülleri
            </Text>
            <Text style={[styles.sectionDescription, { color: theme.colors.textSecondary }]}>
              Aşağıdaki modüller, araç tarafından destekleniyorsa çalıştırılacaktır.
            </Text>

            <DiagnosticModule
              icon="flash"
              title="Gaz Keleği (Throttle) Adaptasyonu"
              description="Gaz keleği adaptasyon değerlerini sıfırla"
              onPress={() => handleAdvancedDiagnostic('Gaz Keleği Adaptasyonu')}
              theme={theme}
            />
            <DiagnosticModule
              icon="swap-horizontal"
              title="EGR Tanılama"
              description="Egzoz Gazı Geri Dönüşümü sistem testi"
              onPress={() => handleAdvancedDiagnostic('EGR Tanılama')}
              theme={theme}
            />
            <DiagnosticModule
              icon="alert-circle"
              title="ABS Tanılama"
              description="Anti-blokaj Fren Sistemi kontrolü"
              onPress={() => handleAdvancedDiagnostic('ABS Tanılama')}
              theme={theme}
            />
            <DiagnosticModule
              icon="compass"
              title="SAS (Direksiyon Açısı) Kalibrasyonu"
              description="Direksiyon açı sensörü kalibrasyonu"
              onPress={() => handleAdvancedDiagnostic('SAS Kalibrasyonu')}
              theme={theme}
            />
            <DiagnosticModule
              icon="hand-left"
              title="EPB (Elektronik Park Freni) Servisi"
              description="Park freni bakım modu"
              onPress={() => handleAdvancedDiagnostic('EPB Servisi')}
              theme={theme}
            />
            <DiagnosticModule
              icon="disc"
              title="Fren Bala tası Sıfırlama"
              description="Fren balataları değişim sonrası sıfırlama"
              onPress={() => handleAdvancedDiagnostic('Fren Balataları Sıfırlama')}
              theme={theme}
            />
            <DiagnosticModule
              icon="filter"
              title="DPF Rejenerasyonu"
              description="Dizel Partikül Filtresi rejenerasyonu"
              onPress={() => handleAdvancedDiagnostic('DPF Rejenerasyonu')}
              theme={theme}
            />
            <DiagnosticModule
              icon="radio-button-on"
              title="TPMS Tanılama"
              description="Lastik Basıncı İzleme Sistemi kontrolü"
              onPress={() => handleAdvancedDiagnostic('TPMS Tanılama')}
              theme={theme}
            />
            <DiagnosticModule
              icon="water"
              title="Yağ Servis Sıfırlama"
              description="Yağ değişim aralığı sıfırlama"
              onPress={() => handleAdvancedDiagnostic('Yağ Servis Sıfırlama')}
              theme={theme}
            />
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const DiagnosticModule = ({ icon, title, description, onPress, theme }: any) => (
  <TouchableOpacity
    style={[styles.moduleCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.moduleIconContainer, { backgroundColor: theme.colors.surface }]}>
      <Ionicons name={icon} size={28} color={theme.colors.primary} />
    </View>
    <View style={styles.moduleContent}>
      <Text style={[styles.moduleTitle, { color: theme.colors.text }]}>{title}</Text>
      <Text style={[styles.moduleDescription, { color: theme.colors.textSecondary }]}>
        {description}
      </Text>
    </View>
    <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#38383A',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  dtcContainer: {
    padding: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dtcCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  dtcHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dtcCode: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  dtcDescription: {
    fontSize: 16,
    marginBottom: 4,
  },
  dtcDescriptionEn: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  emptyState: {
    padding: 48,
    borderRadius: 16,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  advancedContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 24,
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  moduleIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  moduleContent: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  moduleDescription: {
    fontSize: 13,
  },
});
