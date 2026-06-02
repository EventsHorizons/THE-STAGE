/**
 * @file RootNavigator — "The Stage"
 * @description Native stack over main tabs: talent detail, group chat, settings.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabNavigator } from './MainTabNavigator';
import { ArtistProfileScreen } from '../screens/ArtistProfileScreen';
import { GroupChatScreen } from '../screens/GroupChatScreen';
import { ProfileSettingsScreen } from '../screens/ProfileSettingsScreen';
import { RootStackParamList } from './types';
import { Colors } from '../theme/constants';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: Colors.background },
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen name="MainTabs" component={MainTabNavigator} />
    <Stack.Screen name="TalentDetail" component={ArtistProfileScreen} />
    <Stack.Screen name="GroupChat" component={GroupChatScreen} />
    <Stack.Screen
      name="Settings"
      component={ProfileSettingsScreen}
      options={{ presentation: 'modal' }}
    />
    <Stack.Screen
      name="Notifications"
      component={ProfileSettingsScreen}
      options={{ presentation: 'modal' }}
    />
  </Stack.Navigator>
);
