/**
 * @file EmptyState — "The Stage"
 * @description End-of-feed and empty list states.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Inbox } from 'lucide-react-native';
import { Colors, Spacing, Typography } from '../theme/constants';
import { PrimaryButton } from './PrimaryButton';

interface EmptyStateProps {
  readonly title: string;
  readonly message: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  actionLabel,
  onAction,
}) => (
  <View style={styles.container}>
    <Inbox size={48} color={Colors.textMuted} strokeWidth={1.5} />
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
    {actionLabel && onAction ? (
      <PrimaryButton label={actionLabel} onPress={onAction} />
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
    backgroundColor: Colors.background,
  },
  title: {
    ...Typography.displayName,
    fontSize: 22,
    textAlign: 'center',
  },
  message: {
    ...Typography.body,
    textAlign: 'center',
    color: Colors.textFaint,
  },
});
