import React, { createContext } from 'react';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'dark' | 'light';

export interface ThemeColors {
  background: string;
  cardBg: string;
  cardBorder: string;
  controlBg: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  iconColor: string;
  statusBar: 'light-content' | 'dark-content';
  progressTrack: string;
  progressFill: string;
}

export const darkColors: ThemeColors = {
  background: '#000000',
  cardBg: '#18181b', // zinc-900
  cardBorder: '#27272a', // zinc-800
  controlBg: 'rgba(255, 255, 255, 0.12)',
  textPrimary: '#ffffff',
  textSecondary: '#a1a1aa', // zinc-400
  textMuted: '#71717a', // zinc-500
  accent: '#22c55e', // emerald-500
  iconColor: '#ffffff',
  statusBar: 'light-content',
  progressTrack: 'rgba(255, 255, 255, 0.25)',
  progressFill: '#ffffff',
};

export const lightColors: ThemeColors = {
  background: '#f8fafc', // slate-50
  cardBg: '#ffffff',
  cardBorder: '#e2e8f0', // slate-200
  controlBg: '#e2e8f0', // slate-200
  textPrimary: '#0f172a', // slate-900
  textSecondary: '#64748b', // slate-500
  textMuted: '#94a3b8', // slate-400
  accent: '#10b981', // emerald-600
  iconColor: '#0f172a',
  statusBar: 'dark-content',
  progressTrack: 'rgba(15, 23, 42, 0.15)',
  progressFill: '#0f172a',
};

export interface ThemeContextType {
  theme: ThemeMode;
  isDarkMode: boolean;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  isDarkMode: true,
  colors: darkColors,
});

/**
 * Direct Reactive System Hook:
 * Subscribes each component directly to React Native's native useColorScheme().
 * Guarantees zero-lag, instant synchronization across all screens, modals, and components.
 */
export const useTheme = (): ThemeContextType => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const theme: ThemeMode = isDarkMode ? 'dark' : 'light';
  const colors = isDarkMode ? darkColors : lightColors;

  return {
    theme,
    isDarkMode,
    colors,
  };
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const value = useTheme();

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
