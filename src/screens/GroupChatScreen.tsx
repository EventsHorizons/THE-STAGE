/**
 * @file GroupChatScreen — "The Stage"
 * @description Project group chat shell (v3 expansion).
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Colors, Spacing } from '../theme/constants';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList, RootStackNavigationProp } from '../navigation/types';

type GroupChatRouteProp = RouteProp<RootStackParamList, 'GroupChat'>;

export const GroupChatScreen: React.FC = () => {
  const route = useRoute<GroupChatRouteProp>();
  const navigation = useNavigation<RootStackNavigationProp>();
  const { groupId, groupName } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{groupName ?? 'Grupo de proyecto'}</Text>
      <Text style={styles.subtitle}>ID: {groupId}</Text>
      <Text style={styles.hint} onPress={() => navigation.goBack()}>
        ← Volver
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 60,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  title: {
    color: Colors.text,
    fontSize: 24,
    fontFamily: 'Outfit_700Bold',
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
  },
  hint: {
    color: Colors.primaryAccent,
    marginTop: Spacing.lg,
    fontFamily: 'Outfit_600SemiBold',
  },
});
