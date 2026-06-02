/**
 * @file Atomic Components Specification — "The Stage"
 * @description Highly-optimized React Native atomic UI components (Buttons, Avatars, Asymmetric Bento Cards)
 * conforming to golden ratio metrics, 8pt spacings, and Rembrandt shadows.
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  Image,
  View,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { Colors, Spacing, Typography, Shadows } from '../theme';

// ==========================================
// 1. REUSABLE BUTTON WITH BRUTALIST VARIANTS
// ==========================================
interface ButtonProps {
  readonly label: string;
  readonly onPress: () => void;
  readonly variant?: 'primary' | 'outline' | 'ghost';
  readonly isLoading?: boolean;
  readonly disabled?: boolean;
  readonly style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  style,
}) => {
  const buttonStyles = [
    styles.btnBase,
    variant === 'primary' && styles.btnPrimary,
    variant === 'outline' && styles.btnOutline,
    variant === 'ghost' && styles.btnGhost,
    disabled && styles.btnDisabled,
    style,
  ];

  const textStyles = [
    Typography.actionLabel,
    variant === 'primary' && styles.textPrimary,
    variant === 'outline' && styles.textOutline,
    variant === 'ghost' && styles.textGhost,
    disabled && styles.textDisabled,
  ];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || isLoading}
      style={buttonStyles}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'primary' ? '#FFF' : Colors.accentPrimary} size="small" />
      ) : (
        <Text style={textStyles}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

// ==========================================
// 2. HIGH-RESOLUTION OPTIMIZED AVATAR
// ==========================================
interface AvatarProps {
  readonly uri: string;
  readonly size?: 'sm' | 'md' | 'lg';
  readonly isVerified?: boolean;
  readonly style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  size = 'md',
  isVerified = false,
  style,
}) => {
  const sizeMap = {
    sm: 40,
    md: 72,
    lg: 110,
  };

  const currentSize = sizeMap[size];

  return (
    <View style={[styles.avatarWrapper, { width: currentSize, height: currentSize }, style]}>
      {/* Asymmetric gradient border simulation */}
      <View style={[styles.avatarBorderMask, { borderRadius: currentSize / 2 }]} />
      <Image
        source={{ uri }}
        style={[styles.avatarImage, { borderRadius: (currentSize - 4) / 2 }]}
        resizeMode="cover"
      />
      {isVerified && (
        <View style={styles.verifiedDotWrapper}>
          <View style={styles.verifiedDot} />
        </View>
      )}
    </View>
  );
};

// ==========================================
// 3. ASYMMETRIC BENTO GRID CONTAINER
// ==========================================
interface BentoCardProps {
  readonly children: React.ReactNode;
  readonly span?: 1 | 2; // Grid column span equivalent
  readonly style?: ViewStyle;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  span = 1,
  style,
}) => {
  return (
    <View
      style={[
        styles.bentoCardBase,
        span === 2 ? styles.bentoSpan2 : styles.bentoSpan1,
        Shadows.deepRembrandt,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  // Button styles
  btnBase: {
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: 48,
  },
  btnPrimary: {
    backgroundColor: Colors.accentPrimary,
    shadowColor: Colors.accentPrimary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.accentPrimary,
  },
  btnGhost: {
    backgroundColor: 'transparent',
  },
  btnDisabled: {
    backgroundColor: Colors.surfaceCharcoal,
    borderColor: Colors.borderDark,
    opacity: 0.4,
    shadowOpacity: 0,
    elevation: 0,
  },
  textPrimary: {
    color: '#FFF',
  },
  textOutline: {
    color: Colors.textPrimary,
  },
  textGhost: {
    color: Colors.textSecondary,
  },
  textDisabled: {
    color: Colors.textMuted,
  },

  // Avatar styles
  avatarWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBorderMask: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2,
    borderColor: Colors.accentPrimary,
    opacity: 0.85,
  },
  avatarImage: {
    width: '90%',
    height: '90%',
    backgroundColor: '#111',
  },
  verifiedDotWrapper: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: Colors.bgAbsolute,
    padding: 2,
    borderRadius: 999,
  },
  verifiedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.verifiedGreen,
  },

  // Bento Card styles
  bentoCardBase: {
    backgroundColor: Colors.surfaceCharcoal,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.xs,
  },
  bentoSpan1: {
    width: '48%',
  },
  bentoSpan2: {
    width: '100%',
  },
});
