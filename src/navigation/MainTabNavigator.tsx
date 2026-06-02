/**
 * @file MainTabNavigator — minimal tab bar
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
import { Colors, Spacing, Typography } from '../theme/constants';
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
        tabBarInactiveTintColor: Colors.textFaint,
        tabBarIcon: ({ color, focused }) => (
          <Icon size={20} color={color} strokeWidth={focused ? 1.75 : 1.25} />
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
    backgroundColor: 'rgba(11, 11, 11, 0.94)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.borderFaint,
    height: Platform.OS === 'ios' ? 86 : 66,
    paddingBottom: Platform.OS === 'ios' ? 22 : 8,
    paddingTop: 10,
    paddingHorizontal: Spacing.sm,
    elevation: 0,
  },
  tabLabel: {
    ...Typography.caption,
    fontSize: 10,
    marginTop: 4,
  },
});
