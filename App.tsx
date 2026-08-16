import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PlayerModalProvider } from './src/context/PlayerModalProvider';
import { ThemeProvider } from './src/context/ThemeContext';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <PlayerModalProvider>
            <HomeScreen />
          </PlayerModalProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
