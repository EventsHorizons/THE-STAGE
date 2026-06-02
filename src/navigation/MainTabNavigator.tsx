/**
 * @file MainTabNavigator — "The Stage"
 * @description Five-tab bottom navigation: Discover, Explore, Create, Messages, Profile.
 */

import React, { ComponentType } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { LucideProps } from 'lucide-react-native';
import { Zap, Search, PlusCircle, MessageCircle, User } from 'lucide-react-native';
import { SpotlightFeedScreen } from '../screens/SpotlightFeedScreen';
import { ScoutDashboardScreen } from '../screens/ScoutDashboardScreen';
import { CreateScreen } from '../screens/CreateScreen';
import { MessagesScreen } from '../screens/MessagesScreen';
import { ProfileSettingsScreen } from '../screens/ProfileSettingsScreen';
import { Colors, Spacing } from '../theme/constants';
import {
  RootTabParamList,
  ROOT_TAB_CONFIG,
  ScrollableTabMeta,
} from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

const IconMap: Record<ScrollableTabMeta['iconName'], ComponentType<LucideProps>> = {
  zap: Zap,
  search: Search,
  'plus-circle': PlusCircle,
  'message-circle': MessageCircle,
  user: User,
};

export const MainTabNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => {
      const meta = ROOT_TAB_CONFIG.find((t) => t.route === route.name);
      const Icon = meta ? IconMap[meta.iconName] : Zap;
      return {
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.text,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarIcon: ({ color, focused }) => (
          <Icon size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
        ),
        tabBarLabel: meta?.title ?? route.name,
        tabBarLabelStyle: styles.tabLabel,
      };
    }}
  >
    <Tab.Screen name="Discover" component={SpotlightFeedScreen} />
    <Tab.Screen name="Explore" component={ScoutDashboardScreen} />
    <Tab.Screen name="Create" component={CreateScreen} />
    <Tab.Screen name="Messages" component={MessagesScreen} />
    <Tab.Screen name="Profile" component={ProfileSettingsScreen} />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: 'rgba(9, 9, 10, 0.92)',
    borderTopWidth: 0,
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    paddingHorizontal: Spacing.sm,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
  tabLabelActive: {
    fontFamily: 'Outfit_700Bold',
  },
});
