import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance, useColorScheme } from 'react-native';

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

const darkColors: ThemeColors = {
  background: '#000000',
  cardBg: '#18181b', // zinc-900
  cardBorder: '#27272a', // zinc-800
  controlBg: 'rgba(255, 255, 255, 0.1)',
  textPrimary: '#ffffff',
  textSecondary: '#a1a1aa', // zinc-400
  textMuted: '#71717a', // zinc-500
  accent: '#22c55e', // emerald-500
  iconColor: '#ffffff',
  statusBar: 'light-content',
  progressTrack: 'rgba(255, 255, 255, 0.25)',
  progressFill: '#ffffff',
};

const lightColors: ThemeColors = {
  background: '#f8fafc', // slate-50
  cardBg: '#ffffff',
  cardBorder: '#e2e8f0', // slate-200
  controlBg: '#f1f5f9', // slate-100
  textPrimary: '#0f172a', // slate-900
  textSecondary: '#64748b', // slate-500
  textMuted: '#94a3b8', // slate-400
  accent: '#10b981', // emerald-600
  iconColor: '#0f172a',
  statusBar: 'dark-content',
  progressTrack: 'rgba(15, 23, 42, 0.15)',
  progressFill: '#0f172a',
};

interface ThemeContextType {
  theme: ThemeMode;
  isDarkMode: boolean;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  isDarkMode: true,
  colors: darkColors,
});

export const useTheme = () => useContext(ThemeContext);

/**
 * Permanently listens to device system appearance in real time.
 * Syncs seamlessly on initial load and live runtime switches.
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const hookScheme = useColorScheme();
  const [activeScheme, setActiveScheme] = useState<'dark' | 'light'>(() => {
    const initial = Appearance.getColorScheme();
    return initial === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    if (hookScheme) {
      setActiveScheme(hookScheme === 'light' ? 'light' : 'dark');
    }
  }, [hookScheme]);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setActiveScheme(colorScheme === 'light' ? 'light' : 'dark');
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const isDarkMode = activeScheme === 'dark';
  const theme: ThemeMode = isDarkMode ? 'dark' : 'light';
  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDarkMode,
        colors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
