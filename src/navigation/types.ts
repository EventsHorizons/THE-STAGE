/**
 * @file Navigation Types — The Stage
 * @description Root stack and tab navigation parameter lists for the Expo app.
 */

export type RootTabParamList = {
  Discover: undefined;
  Explore: undefined;
  Create: undefined;
  Messages: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  TalentDetail: { profileId: string; fromTab?: keyof RootTabParamList };
  GroupChat: { groupId: string };
  Settings: undefined;
  Notifications: undefined;
};

export type RootTabScreenName = keyof RootTabParamList;
export type RootStackScreenName = keyof RootStackParamList;

export type TalentSwipeAction = 'like' | 'pass' | 'bookmark';
export type GestureDirection = 'left' | 'right' | 'up' | 'tap' | 'longPress';

export interface SwipePayload {
  readonly profileId: string;
  readonly action: TalentSwipeAction;
  readonly timestamp: Date;
}

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
