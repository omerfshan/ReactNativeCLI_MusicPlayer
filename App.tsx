import React from 'react';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LocalizationProvider } from './src/context/LocalizationContext';
import { PlayerModalProvider } from './src/context/PlayerModalProvider';
import { ThemeProvider } from './src/context/ThemeContext';
import HomeScreen from './src/screens/HomeScreen';

// Ignore non-critical LogBox warnings in development
LogBox.ignoreAllLogs();

export default function App() {
  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaProvider>
        <LocalizationProvider>
          <ThemeProvider>
            <PlayerModalProvider>
              <HomeScreen />
            </PlayerModalProvider>
          </ThemeProvider>
        </LocalizationProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
