/**
 * @file AppNavigator — "The Stage"
 * @description Clean Bottom Tab navigation integrated with the mock Expo-compatible setup.
 * Routes between SpotlightFeedScreen (discovery) and ArtistProfileScreen (bento profile).
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { Zap, Search, User } from 'lucide-react-native';
import { SpotlightFeedScreen } from '../screens/SpotlightFeedScreen';
import { ArtistProfileScreen } from '../screens/ArtistProfileScreen';
import { ScoutDashboardScreen } from '../screens/ScoutDashboardScreen';
import { Artist } from '../types';
import { Colors, Spacing } from '../theme/constants';

interface AppNavigatorProps {
  readonly currentScreen: 'Spotlight' | 'Profile' | 'Scout';
  readonly navigateTo: (screen: 'Spotlight' | 'Profile' | 'Scout', artist?: Artist) => void;
  readonly selectedArtistForProfile: Artist;
}

export const AppNavigator: React.FC<AppNavigatorProps> = ({
  currentScreen,
  navigateTo,
  selectedArtistForProfile,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.screenWrapper}>
        {currentScreen === 'Spotlight' ? (
          <SpotlightFeedScreen
            navigation={{
              navigate: (_screen: string, params: { artist: Artist }) => {
                navigateTo('Profile', params?.artist);
              },
            }}
          />
        ) : currentScreen === 'Scout' ? (
          <ScoutDashboardScreen
            onSelectArtist={(artist) => navigateTo('Profile', artist)}
          />
        ) : (
          <ArtistProfileScreen
            route={{ params: { artist: selectedArtistForProfile } }}
            navigation={{
              goBack: () => navigateTo('Spotlight'),
            }}
          />
        )}
      </View>

      {/* Modern Minimalist Bottom Tab Bar (Spotify-inspired) */}
      <View style={styles.tabBarContainer}>
        <View style={styles.tabBarBlur} />
        <View style={styles.tabBar}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigateTo('Spotlight')}
            style={styles.tabItem}
          >
            <Zap 
              size={24} 
              color={currentScreen === 'Spotlight' ? Colors.text : Colors.textMuted} 
              strokeWidth={currentScreen === 'Spotlight' ? 2.5 : 2}
            />
            <Text style={[
              styles.tabLabel, 
              currentScreen === 'Spotlight' ? styles.tabLabelActive : styles.tabLabelInactive
            ]}>
              Feed
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigateTo('Scout')}
            style={styles.tabItem}
          >
            <Search 
              size={24} 
              color={currentScreen === 'Scout' ? Colors.text : Colors.textMuted} 
              strokeWidth={currentScreen === 'Scout' ? 2.5 : 2}
            />
            <Text style={[
              styles.tabLabel, 
              currentScreen === 'Scout' ? styles.tabLabelActive : styles.tabLabelInactive
            ]}>
              Explorar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigateTo('Profile')}
            style={styles.tabItem}
          >
            <User 
              size={24} 
              color={currentScreen === 'Profile' ? Colors.text : Colors.textMuted} 
              strokeWidth={currentScreen === 'Profile' ? 2.5 : 2}
            />
            <Text style={[
              styles.tabLabel, 
              currentScreen === 'Profile' ? styles.tabLabelActive : styles.tabLabelInactive
            ]}>
              Perfil
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screenWrapper: {
    flex: 1,
  },
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 90 : 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarBlur: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9, 9, 10, 0.85)',
  },
  tabBar: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    paddingBottom: Platform.OS === 'ios' ? 25 : 0,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: Colors.text,
  },
  tabLabelInactive: {
    color: Colors.textMuted,
  },
});
