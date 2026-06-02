/**
 * @file App — "The Stage" — Self-contained MVP
 * @description Highly-optimized React Native app with modular architecture.
 * Full dark brutalist UI with Spotlight Feed + Artist Profile screens.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  StatusBar as RNStatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Outfit_400Regular, Outfit_600SemiBold, Outfit_700Bold, Outfit_800ExtraBold } from '@expo-google-fonts/outfit';

// Import optimized modular components
import { AppNavigator } from './src/navigation/AppNavigator';
import { MOCK_TALENTS } from './src/services/mockData';
import { Artist } from './src/types';
import { Colors } from './src/theme/constants';

export default function App() {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
  });

  const [currentScreen, setCurrentScreen] = useState<'Spotlight' | 'Profile' | 'Scout'>('Spotlight');
  const [selectedArtist, setSelectedArtist] = useState<Artist>(MOCK_TALENTS[0]);

  const navigateTo = (screen: 'Spotlight' | 'Profile' | 'Scout', artist?: Artist) => {
    if (artist) setSelectedArtist(artist);
    setCurrentScreen(screen);
  };

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primaryAccent} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AppNavigator
        currentScreen={currentScreen}
        navigateTo={navigateTo}
        selectedArtistForProfile={selectedArtist}
      />
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
