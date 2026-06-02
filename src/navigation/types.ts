/**
 * @file Navigation Types — The Stage
 * @description Root stack, tab param lists, and typed screen props for React Navigation.
 */

import type { NavigatorScreenParams, CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { ArtistProfile } from '../types';

// ─── Tab navigator ───────────────────────────────────────────────────────────

export type RootTabParamList = {
  Discover: undefined;
  Explore: undefined;
  Create: undefined;
  Messages: undefined;
  Profile: undefined;
};

export type RootTabScreenName = keyof RootTabParamList;

// ─── Root stack ──────────────────────────────────────────────────────────────

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<RootTabParamList>;
  TalentDetail: {
    profileId: string;
    artist?: ArtistProfile;
    fromTab?: RootTabScreenName;
  };
  GroupChat: { groupId: string; groupName?: string };
  Settings: undefined;
  Notifications: undefined;
};

export type RootStackScreenName = keyof RootStackParamList;

// ─── Gestures & swipe payloads ─────────────────────────────────────────────

export type TalentSwipeAction = 'like' | 'pass' | 'bookmark';
export type GestureDirection = 'left' | 'right' | 'up' | 'tap' | 'longPress';

export interface SwipePayload {
  readonly profileId: string;
  readonly action: TalentSwipeAction;
  readonly timestamp: Date;
}

// ─── Tab bar metadata ────────────────────────────────────────────────────────

export interface ScrollableTabMeta {
  readonly title: string;
  readonly route: RootTabScreenName;
  readonly iconName: 'zap' | 'search' | 'plus-circle' | 'message-circle' | 'user';
}

export const ROOT_TAB_CONFIG: ReadonlyArray<ScrollableTabMeta> = [
  { title: 'Descubrir', route: 'Discover', iconName: 'zap' },
  { title: 'Explorar', route: 'Explore', iconName: 'search' },
  { title: 'Crear', route: 'Create', iconName: 'plus-circle' },
  { title: 'Mensajes', route: 'Messages', iconName: 'message-circle' },
  { title: 'Perfil', route: 'Profile', iconName: 'user' },
] as const;

// ─── Typed navigation helpers ────────────────────────────────────────────────

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type MainTabNavigationProp = BottomTabNavigationProp<RootTabParamList>;

export type DiscoverTabNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, 'Discover'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export type TalentDetailRouteProp = RouteProp<RootStackParamList, 'TalentDetail'>;

export type TalentDetailScreenProps = {
  readonly navigation: RootStackNavigationProp;
  readonly route: TalentDetailRouteProp;
};

export type DiscoverScreenProps = {
  readonly navigation: DiscoverTabNavigationProp;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
