import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

type ThemeMode = 'light' | 'dark';

type ThemeColors = {
  primary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  inputBackground: string;
  buttonText: string;
  saveButton: string;
  savedButton: string;
  removeButton: string;
  applyButton: string;
};

type Theme = {
  mode: ThemeMode;
  colors: ThemeColors;
};

const lightColors: ThemeColors = {
  primary: '#2196F3',
  background: '#f5f5f5',
  card: 'white',
  text: '#333',
  border: '#ddd',
  inputBackground: '#f9f9f9',
  buttonText: 'white',
  saveButton: '#e0e0e0',
  savedButton: '#4caf50',
  removeButton: '#ff4444',
  applyButton: '#2196F3'
};

const darkColors: ThemeColors = {
  primary: '#1E88E5',
  background: '#121212',
  card: '#1E1E1E',
  text: '#f5f5f5',
  border: '#333',
  inputBackground: '#2D2D2D',
  buttonText: 'white',
  saveButton: '#333',
  savedButton: '#388E3C',
  removeButton: '#D32F2F',
  applyButton: '#1976D2'
};

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: { mode: 'light', colors: lightColors },
  toggleTheme: () => {},
  isDark: false
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const colorScheme = Appearance.getColorScheme();
    return {
      mode: colorScheme || 'light',
      colors: colorScheme === 'dark' ? darkColors : lightColors
    };
  });

  const toggleTheme = () => {
    setTheme(current => ({
      mode: current.mode === 'light' ? 'dark' : 'light',
      colors: current.mode === 'light' ? darkColors : lightColors
    }));
  };

  useEffect(() => {
    const subscription = Appearance.addChangeListener((preferences: { colorScheme: ColorSchemeName }) => {
      const newMode = preferences.colorScheme || 'light';
      setTheme({
        mode: newMode,
        colors: newMode === 'dark' ? darkColors : lightColors
      });
    });
    return () => subscription.remove();
  }, []);

  const contextValue = {
    theme,
    toggleTheme,
    isDark: theme.mode === 'dark'
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};