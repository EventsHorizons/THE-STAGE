/**
 * @file BentoCard — matte modular surface (Cursor grid)
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Glow, Borders, Spacing } from '../theme/constants';

interface BentoCardProps {
  readonly children: React.ReactNode;
  readonly style?: ViewStyle;
  readonly active?: boolean;
}

export const BentoCard: React.FC<BentoCardProps> = ({ children, style, active = false }) => (
  <View style={[styles.card, active && styles.cardActive, style]}>{children}</View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceTranslucent,
    padding: Spacing.md,
    borderRadius: Borders.radiusMd,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderFaint,
    overflow: 'hidden',
  },
  cardActive: {
    borderColor: Colors.accentBorder,
    ...Glow.interactive,
  },
});
