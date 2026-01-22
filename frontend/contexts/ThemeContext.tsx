import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeType = 'dark-sport' | 'green-metallic';

interface Theme {
  type: ThemeType;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    border: string;
    cardBg: string;
  };
}

const darkSportTheme: Theme = {
  type: 'dark-sport',
  colors: {
    primary: '#FF3B30',
    secondary: '#FF9500',
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    accent: '#0A84FF',
    success: '#30D158',
    warning: '#FF9500',
    error: '#FF3B30',
    border: '#38383A',
    cardBg: '#2C2C2E',
  },
};

const greenMetallicTheme: Theme = {
  type: 'green-metallic',
  colors: {
    primary: '#00FF88',
    secondary: '#00D4AA',
    background: '#0A1F1A',
    surface: '#1A2F2A',
    text: '#E0FFE0',
    textSecondary: '#88AA99',
    accent: '#00FFCC',
    success: '#00FF88',
    warning: '#FFD700',
    error: '#FF4444',
    border: '#2A4A3A',
    cardBg: '#152820',
  },
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(darkSportTheme);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('app_theme');
      if (savedTheme === 'green-metallic') {
        setTheme(greenMetallicTheme);
      }
    } catch (error) {
      console.log('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme.type === 'dark-sport' ? greenMetallicTheme : darkSportTheme;
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('app_theme', newTheme.type);
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
