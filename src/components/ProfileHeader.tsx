/**
 * @file ProfileHeader — "The Stage"
 * @description Avatar, validation badge, and availability for profile / bento views.
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import { Colors, Spacing } from '../theme/constants';

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
          <CheckCircle2 size={14} color={Colors.verified} fill={Colors.verified} />
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
    borderRadius: 36,
    backgroundColor: Colors.surface,
  },
  avatarPlaceholder: {
    borderWidth: 1,
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
    color: Colors.text,
    fontSize: 22,
    fontFamily: 'Outfit_800ExtraBold',
  },
  role: {
    color: Colors.primaryAccent,
    fontSize: 14,
    fontFamily: 'Outfit_700Bold',
  },
  availabilityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.verified,
  },
  availabilityText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontFamily: 'Outfit_600SemiBold',
  },
});
