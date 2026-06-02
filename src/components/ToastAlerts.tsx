/**
 * @file ToastAlerts — "The Stage"
 * @description Lightweight match / error banners (non-blocking).
 */

import React, { useEffect } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';
import { Zap } from 'lucide-react-native';
import { Colors, Spacing } from '../theme/constants';

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
      friction: 7,
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
        {variant === 'match' ? <Zap size={18} color="#FFF" fill="#FFF" /> : null}
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
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toastMatch: {
    borderColor: Colors.primaryAccent,
  },
  text: {
    color: Colors.text,
    fontSize: 14,
    fontFamily: 'Outfit_600SemiBold',
    flex: 1,
  },
});
