/**
 * @file ProfileHeader — minimal identity row
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import { Colors, Spacing, Typography, Borders } from '../theme/constants';

interface ProfileHeaderProps {
  readonly name: string;
  readonly roleLabel: string;
  readonly avatarUrl?: string;
  readonly isValidated?: boolean;
  readonly availabilityLabel?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  roleLabel,
  avatarUrl,
  isValidated = false,
  availabilityLabel,
}) => (
  <View style={styles.wrapper}>
    <View style={styles.avatarRing}>
      {avatarUrl ? (
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarPlaceholder]} />
      )}
      {isValidated ? (
        <View style={styles.verifiedBadge}>
          <CheckCircle2 size={12} color={Colors.verified} strokeWidth={1.5} />
        </View>
      ) : null}
    </View>
    <View style={styles.meta}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.role}>{roleLabel}</Text>
      {availabilityLabel ? (
        <View style={styles.availabilityPill}>
          <View style={styles.availabilityDot} />
          <Text style={styles.availabilityText}>{availabilityLabel}</Text>
        </View>
      ) : null}
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  avatarRing: {
    position: 'relative',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: Borders.radiusMd,
    backgroundColor: Colors.surface,
  },
  avatarPlaceholder: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 2,
  },
  meta: {
    flex: 1,
    gap: 4,
  },
  name: {
    ...Typography.displayName,
    fontSize: 22,
  },
  role: {
    ...Typography.subtitle,
    fontSize: 13,
  },
  availabilityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  availabilityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.verified,
  },
  availabilityText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
});
