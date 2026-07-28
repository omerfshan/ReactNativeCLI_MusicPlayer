// App.tsx
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PlayerSheetProvider } from './src/context/PlayerSheetContext';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PlayerSheetProvider>
          <HomeScreen />
        </PlayerSheetProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
