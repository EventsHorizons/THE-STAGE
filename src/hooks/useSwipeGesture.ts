/**
 * @file useSwipeGesture — "The Stage"
 * @description PanResponder + Animated bridge wired to the swipe engine.
 */

import { useCallback, useMemo, useRef } from 'react';
import { Animated, PanResponder, Dimensions } from 'react-native';
import { getSwipeExitOffset, resolveSwipeAction } from '../gestures/swipeEngine';
import type { TalentSwipeAction } from '../navigation/types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SPRING_CONFIG = {
  friction: 6,
  tension: 80,
  useNativeDriver: false as const,
};

const EXIT_DURATION_MS = 220;

interface UseSwipeGestureOptions {
  readonly enabled?: boolean;
  readonly onSwipeComplete: (action: TalentSwipeAction) => void;
  readonly onTap?: () => void;
}

export function useSwipeGesture({
  enabled = true,
  onSwipeComplete,
  onTap,
}: UseSwipeGestureOptions) {
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const isAnimating = useRef(false);

  const resetPosition = useCallback(() => {
    position.setValue({ x: 0, y: 0 });
    opacity.setValue(1);
    isAnimating.current = false;
  }, [opacity, position]);

  const animateExit = useCallback(
    (action: TalentSwipeAction) => {
      if (isAnimating.current) return;
      isAnimating.current = true;
      const exit = getSwipeExitOffset(action, SCREEN_WIDTH, SCREEN_HEIGHT);

      Animated.parallel([
        Animated.timing(position, {
          toValue: { x: exit.x, y: exit.y },
          duration: EXIT_DURATION_MS,
          useNativeDriver: false,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: EXIT_DURATION_MS,
          useNativeDriver: false,
        }),
      ]).start(() => {
        onSwipeComplete(action);
        resetPosition();
      });
    },
    [onSwipeComplete, opacity, position, resetPosition],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => enabled && !isAnimating.current,
        onMoveShouldSetPanResponder: (_, gesture) =>
          enabled &&
          !isAnimating.current &&
          (Math.abs(gesture.dx) > 4 || Math.abs(gesture.dy) > 4),
        onPanResponderMove: (_, gesture) => {
          position.setValue({ x: gesture.dx, y: gesture.dy });
        },
        onPanResponderRelease: (_, gesture) => {
          const action = resolveSwipeAction(
            {
              translationX: gesture.dx,
              translationY: gesture.dy,
              velocityX: gesture.vx,
              velocityY: gesture.vy,
            },
            { screenWidth: SCREEN_WIDTH, screenHeight: SCREEN_HEIGHT },
          );

          if (action) {
            animateExit(action);
            return;
          }

          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            ...SPRING_CONFIG,
          }).start();
        },
      }),
    [animateExit, enabled, position],
  );

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-12deg', '0deg', '12deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SCREEN_WIDTH * 0.25],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const passOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH * 0.25, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const bookmarkOpacity = position.y.interpolate({
    inputRange: [-SCREEN_HEIGHT * 0.18, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const cardStyle = {
    opacity,
    transform: [
      { translateX: position.x },
      { translateY: position.y },
      { rotate },
    ],
  };

  const handleTap = useCallback(() => {
    if (!isAnimating.current && onTap) {
      onTap();
    }
  }, [onTap]);

  return {
    cardStyle,
    panHandlers: panResponder.panHandlers,
    likeOpacity,
    passOpacity,
    bookmarkOpacity,
    handleTap,
    resetPosition,
  };
}
