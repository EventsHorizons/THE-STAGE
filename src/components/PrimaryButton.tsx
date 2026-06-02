/**
 * @file PrimaryButton — outline + vinotinto ambient glow (no solid fill)
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Glow, Borders, Spacing, Typography } from '../theme/constants';

interface PrimaryButtonProps {
  readonly label: string;
  readonly onPress: () => void;
  readonly disabled?: boolean;
  readonly style?: ViewStyle;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  disabled = false,
  style,
}) => (
  <TouchableOpacity
    activeOpacity={0.75}
    onPress={onPress}
    disabled={disabled}
    style={[styles.container, disabled && styles.disabled, style]}
  >
    <Text style={styles.text}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    minHeight: 48,
    borderRadius: Borders.radiusMd,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.accentBorder,
    backgroundColor: 'rgba(122, 6, 34, 0.06)',
    ...Glow.interactive,
  },
  disabled: {
    opacity: 0.4,
    borderColor: Colors.border,
  },
  text: {
    ...Typography.moduleLabel,
    color: Colors.text,
    letterSpacing: 1.4,
  },
});
