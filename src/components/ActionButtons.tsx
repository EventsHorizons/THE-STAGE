/**
 * @file ActionButtons — minimal icon rail (Cursor-style)
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Bookmark, Heart, X } from 'lucide-react-native';
import { Colors, Glow, Borders, Spacing } from '../theme/constants';
import type { TalentSwipeAction } from '../navigation/types';

const ICON = { size: 20, strokeWidth: 1.5 as const };
const BTN = 46;

interface ActionButtonsProps {
  readonly onAction: (action: TalentSwipeAction) => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onAction }) => (
  <View style={styles.container}>
    <TouchableOpacity
      style={styles.circle}
      onPress={() => onAction('bookmark')}
      accessibilityLabel="Guardar"
      activeOpacity={0.7}
    >
      <Bookmark size={ICON.size} color={Colors.text} strokeWidth={ICON.strokeWidth} />
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.circle}
      onPress={() => onAction('pass')}
      accessibilityLabel="Pasar"
      activeOpacity={0.7}
    >
      <X size={ICON.size} color={Colors.textFaint} strokeWidth={ICON.strokeWidth} />
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.circle, styles.circleConnect]}
      onPress={() => onAction('like')}
      accessibilityLabel="Conectar"
      activeOpacity={0.7}
    >
      <Heart size={ICON.size} color={Colors.accentVinotinto} strokeWidth={ICON.strokeWidth} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: Spacing.md,
    bottom: 148,
    gap: 14,
    alignItems: 'center',
  },
  circle: {
    width: BTN,
    height: BTN,
    borderRadius: Borders.radiusFull,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    backgroundColor: 'rgba(11, 11, 11, 0.35)',
  },
  circleConnect: {
    borderColor: Colors.accentBorder,
    ...Glow.interactive,
  },
});
