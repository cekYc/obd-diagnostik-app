import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useOBD } from '../../contexts/OBDContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { vehicleDatabase, getBrands, getModels, getYears, getEngines } from '../../data/vehicleDatabase';
import { useRouter } from 'expo-router';

type SelectionStep = 'brand' | 'model' | 'year' | 'engine' | 'complete';

export default function VehicleSelection() {
  const { theme } = useTheme();
  const { setSelectedVehicle } = useOBD();
  const router = useRouter();
  
  const [step, setStep] = useState<SelectionStep>('brand');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedEngine, setSelectedEngine] = useState('');

  const brands = getBrands();
  const models = selectedBrand ? getModels(selectedBrand) : [];
  const years = selectedModel ? getYears(selectedBrand, selectedModel) : [];
  const engines = selectedModel ? getEngines(selectedBrand, selectedModel) : [];

  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand);
    setSelectedModel('');
    setSelectedYear('');
    setSelectedEngine('');
    setStep('model');
  };

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
    setSelectedYear('');
    setSelectedEngine('');
    setStep('year');
  };

  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
    setSelectedEngine('');
    setStep('engine');
  };

  const handleEngineSelect = (engine: string) => {
    setSelectedEngine(engine);
    setStep('complete');
    setSelectedVehicle({
      brand: selectedBrand,
      model: selectedModel,
      year: selectedYear,
      engine: engine,
    });
  };

  const handleStartDiagnostic = () => {
    router.push('/(drawer)/dashboard');
  };

  const resetSelection = () => {
    setSelectedBrand('');
    setSelectedModel('');
    setSelectedYear('');
    setSelectedEngine('');
    setStep('brand');
  };

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.surface]}
      style={styles.container}
    >
      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <ProgressStep
          icon="business"
          label="Marka"
          active={step === 'brand'}
          completed={!!selectedBrand}
          theme={theme}
        />
        <View style={[styles.progressLine, { backgroundColor: selectedModel ? theme.colors.primary : theme.colors.border }]} />
        <ProgressStep
          icon="car"
          label="Model"
          active={step === 'model'}
          completed={!!selectedModel}
          theme={theme}
        />
        <View style={[styles.progressLine, { backgroundColor: selectedYear ? theme.colors.primary : theme.colors.border }]} />
        <ProgressStep
          icon="calendar"
          label="Yıl"
          active={step === 'year'}
          completed={!!selectedYear}
          theme={theme}
        />
        <View style={[styles.progressLine, { backgroundColor: selectedEngine ? theme.colors.primary : theme.colors.border }]} />
        <ProgressStep
          icon="speedometer"
          label="Motor"
          active={step === 'engine'}
          completed={!!selectedEngine}
          theme={theme}
        />
      </View>

      {/* Selection Area */}
      <ScrollView style={styles.scrollView}>
        {step === 'brand' && (
          <SelectionList
            title="Marka Seçin"
            items={brands}
            onSelect={handleBrandSelect}
            theme={theme}
          />
        )}

        {step === 'model' && (
          <SelectionList
            title="Model Seçin"
            items={models}
            onSelect={handleModelSelect}
            theme={theme}
          />
        )}

        {step === 'year' && (
          <SelectionList
            title="Yıl Seçin"
            items={years}
            onSelect={handleYearSelect}
            theme={theme}
          />
        )}

        {step === 'engine' && (
          <SelectionList
            title="Motor Seçin"
            items={engines}
            onSelect={handleEngineSelect}
            theme={theme}
          />
        )}

        {step === 'complete' && (
          <View style={styles.completeContainer}>
            <View style={[styles.completeCard, { backgroundColor: theme.colors.cardBg }]}>
              <Ionicons name="checkmark-circle" size={64} color={theme.colors.success} />
              <Text style={[styles.completeTitle, { color: theme.colors.text }]}>
                Araç Seçildi
              </Text>
              <View style={styles.vehicleDetails}>
                <Text style={[styles.vehicleDetailText, { color: theme.colors.text }]}>
                  {selectedBrand} {selectedModel}
                </Text>
                <Text style={[styles.vehicleDetailSubtext, { color: theme.colors.textSecondary }]}>
                  {selectedYear} - {selectedEngine}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.startButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleStartDiagnostic}
              >
                <Text style={styles.startButtonText}>Tanılamaya Başla</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.resetButton, { borderColor: theme.colors.border }]}
                onPress={resetSelection}
              >
                <Text style={[styles.resetButtonText, { color: theme.colors.textSecondary }]}>
                  Yeniden Seç
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const ProgressStep = ({ icon, label, active, completed, theme }: any) => (
  <View style={styles.progressStep}>
    <View
      style={[
        styles.progressCircle,
        {
          backgroundColor: completed ? theme.colors.primary : active ? theme.colors.surface : theme.colors.cardBg,
          borderColor: active ? theme.colors.primary : theme.colors.border,
        },
      ]}
    >
      <Ionicons
        name={completed ? 'checkmark' : icon}
        size={20}
        color={completed || active ? theme.colors.text : theme.colors.textSecondary}
      />
    </View>
    <Text style={[styles.progressLabel, { color: active ? theme.colors.text : theme.colors.textSecondary }]}>
      {label}
    </Text>
  </View>
);

const SelectionList = ({ title, items, onSelect, theme }: any) => (
  <View style={styles.selectionContainer}>
    <Text style={[styles.selectionTitle, { color: theme.colors.text }]}>{title}</Text>
    {items.map((item: string) => (
      <TouchableOpacity
        key={item}
        style={[styles.selectionItem, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}
        onPress={() => onSelect(item)}
        activeOpacity={0.7}
      >
        <Text style={[styles.selectionItemText, { color: theme.colors.text }]}>{item}</Text>
        <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  progressStep: {
    alignItems: 'center',
  },
  progressCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
  },
  progressLine: {
    flex: 1,
    height: 2,
    marginHorizontal: 4,
  },
  scrollView: {
    flex: 1,
  },
  selectionContainer: {
    padding: 16,
  },
  selectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  selectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  selectionItemText: {
    fontSize: 16,
  },
  completeContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  completeCard: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
  },
  completeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 24,
  },
  vehicleDetails: {
    alignItems: 'center',
    marginBottom: 32,
  },
  vehicleDetailText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  vehicleDetailSubtext: {
    fontSize: 16,
  },
  startButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
  },
});
