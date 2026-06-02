/**
 * @file ToastAlerts — hairline toast with vinotinto edge glow
 */

import React, { useEffect } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { Colors, Spacing, Typography, Glow, Borders } from '../theme/constants';

export type ToastVariant = 'match' | 'error' | 'info';

interface ToastAlertsProps {
  readonly visible: boolean;
  readonly message: string;
  readonly variant?: ToastVariant;
  readonly onHide?: () => void;
  readonly durationMs?: number;
}

export const ToastAlerts: React.FC<ToastAlertsProps> = ({
  visible,
  message,
  variant = 'info',
  onHide,
  durationMs = 2800,
}) => {
  const translateY = React.useRef(new Animated.Value(-80)).current;

  useEffect(() => {
    if (!visible) return;

    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      friction: 8,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(translateY, {
        toValue: -80,
        duration: 200,
        useNativeDriver: true,
      }).start(() => onHide?.());
    }, durationMs);

    return () => clearTimeout(timer);
  }, [visible, durationMs, onHide, translateY]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ translateY }] }]}>
      <View style={[styles.toast, variant === 'match' && styles.toastMatch]}>
        {variant === 'match' ? (
          <Sparkles size={16} color={Colors.accentVinotinto} strokeWidth={1.5} />
        ) : null}
        <Text style={styles.text}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 56,
    left: Spacing.md,
    right: Spacing.md,
    zIndex: 100,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceTranslucent,
    borderRadius: Borders.radiusMd,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  toastMatch: {
    borderColor: Colors.accentBorder,
    ...Glow.interactive,
  },
  text: {
    ...Typography.body,
    flex: 1,
    fontSize: 13,
  },
});
