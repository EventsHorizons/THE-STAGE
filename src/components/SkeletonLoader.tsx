/**
 * @file SkeletonLoader — "The Stage"
 * @description Placeholder shimmer blocks for card and bento geometry.
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions, ViewStyle } from 'react-native';
import { Colors, Spacing } from '../theme/constants';

const { width } = Dimensions.get('window');

interface SkeletonLoaderProps {
  readonly variant?: 'card' | 'bento';
  readonly style?: ViewStyle;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'card',
  style,
}) => {
  const pulse = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.65, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.35, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  if (variant === 'bento') {
    return (
      <View style={[styles.bentoGrid, style]}>
        <Animated.View style={[styles.bentoLarge, { opacity: pulse }]} />
        <View style={styles.bentoColumn}>
          <Animated.View style={[styles.bentoSmall, { opacity: pulse }]} />
          <Animated.View style={[styles.bentoSmall, { opacity: pulse }]} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.card, style]}>
      <Animated.View style={[styles.cardMedia, { opacity: pulse }]} />
      <View style={styles.cardFooter}>
        <Animated.View style={[styles.lineWide, { opacity: pulse }]} />
        <Animated.View style={[styles.lineNarrow, { opacity: pulse }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  cardMedia: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  cardFooter: {
    padding: Spacing.md,
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
  },
  lineWide: {
    height: 18,
    width: '55%',
    borderRadius: 6,
    backgroundColor: Colors.border,
  },
  lineNarrow: {
    height: 12,
    width: '35%',
    borderRadius: 6,
    backgroundColor: Colors.border,
  },
  bentoGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.md,
  },
  bentoLarge: {
    flex: 1.6,
    height: 200,
    borderRadius: 16,
    backgroundColor: Colors.surface,
  },
  bentoColumn: {
    flex: 1,
    gap: Spacing.sm,
  },
  bentoSmall: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    minHeight: 96,
  },
});
