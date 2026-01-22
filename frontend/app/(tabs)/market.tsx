import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';

export default function Market() {
  const { theme } = useTheme();
  return (
    <LinearGradient colors={[theme.colors.background, theme.colors.surface]} style={{flex:1}}>
      <Text style={{color: theme.colors.text, fontSize: 24, textAlign: 'center', marginTop: 40}}>Market Yakında!</Text>
    </LinearGradient>
  );
}
