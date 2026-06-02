/**
 * @file AppNavigator — "The Stage"
 * @description Clean Bottom Tab navigation integrated with the mock Expo-compatible setup.
 * Routes between SpotlightFeedScreen (discovery) and ArtistProfileScreen (bento profile).
 */

import React, { ComponentType } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import type { LucideProps } from 'lucide-react-native';
import { Zap, Search, PlusCircle, MessageCircle, User } from 'lucide-react-native';
import { SpotlightFeedScreen } from '../screens/SpotlightFeedScreen';
import { ArtistProfileScreen } from '../screens/ArtistProfileScreen';
import { ScoutDashboardScreen } from '../screens/ScoutDashboardScreen';
import { CreateScreen } from '../screens/CreateScreen';
import { MessagesScreen } from '../screens/MessagesScreen';
import { Artist } from '../types';
import { Colors, Spacing } from '../theme/constants';
import { RootTabScreenName, ROOT_TAB_CONFIG, ScrollableTabMeta } from './types';

interface AppNavigatorProps {
  readonly currentScreen: RootTabScreenName;
  readonly navigateTo: (screen: RootTabScreenName, artist?: Artist) => void;
  readonly selectedArtistForProfile: Artist;
}

const IconMap: Record<ScrollableTabMeta['iconName'], ComponentType<LucideProps>> = {
  zap: Zap,
  search: Search,
  'plus-circle': PlusCircle,
  'message-circle': MessageCircle,
  user: User,
};

export const AppNavigator: React.FC<AppNavigatorProps> = ({
  currentScreen,
  navigateTo,
  selectedArtistForProfile,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.screenWrapper}>
        {currentScreen === 'Discover' ? (
          <SpotlightFeedScreen
            navigation={{
              navigate: (_screen: string, params: { artist: Artist }) => {
                navigateTo('Profile', params?.artist);
              },
            }}
          />
        ) : currentScreen === 'Explore' ? (
          <ScoutDashboardScreen
            onSelectArtist={(artist) => navigateTo('Profile', artist)}
          />
        ) : currentScreen === 'Create' ? (
          <CreateScreen />
        ) : currentScreen === 'Messages' ? (
          <MessagesScreen />
        ) : (
          <ArtistProfileScreen
            route={{ params: { artist: selectedArtistForProfile } }}
            navigation={{
              goBack: () => navigateTo('Discover'),
            }}
          />
        )}
      </View>

      <View style={styles.tabBarContainer}>
        <View style={styles.tabBarBlur} />
        <View style={styles.tabBar}>
          {ROOT_TAB_CONFIG.map((tab) => {
            const Icon = IconMap[tab.iconName];
            const isActive = currentScreen === tab.route;
            return (
              <TouchableOpacity
                key={tab.route}
                activeOpacity={0.75}
                onPress={() => navigateTo(tab.route)}
                style={styles.tabItem}
              >
                <Icon
                  size={24}
                  color={isActive ? Colors.text : Colors.textMuted}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <Text style={[
                  styles.tabLabel,
                  isActive ? styles.tabLabelActive : styles.tabLabelInactive,
                ]}>
                  {tab.title}
                </Text>
              </TouchableOpacity>
            );
          })}
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
