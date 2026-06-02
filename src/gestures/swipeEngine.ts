/**
 * @file Swipe Engine — "The Stage"
 * @description Pure math for Tinder-style gesture resolution (left / right / up).
 */

import type { TalentSwipeAction } from '../navigation/types';

export interface SwipeMetrics {
  readonly translationX: number;
  readonly translationY: number;
  readonly velocityX: number;
  readonly velocityY: number;
}

export interface SwipeEngineConfig {
  readonly screenWidth: number;
  readonly screenHeight: number;
  readonly thresholdRatio?: number;
  readonly velocityThreshold?: number;
  readonly upThresholdRatio?: number;
}

const DEFAULT_THRESHOLD_RATIO = 0.25;
const DEFAULT_VELOCITY_THRESHOLD = 0.35;
const DEFAULT_UP_THRESHOLD_RATIO = 0.18;

/** Normalized horizontal progress 0–1 for overlay feedback. */
export function getSwipeProgress(translationX: number, screenWidth: number): number {
  return Math.min(Math.abs(translationX) / screenWidth, 1);
}

/** Card tilt in degrees derived from horizontal drag. */
export function getCardRotation(
  translationX: number,
  screenWidth: number,
  maxDegrees = 12,
): number {
  return (translationX / screenWidth) * maxDegrees;
}

/** Exit target off-screen coordinates for a committed swipe. */
export function getSwipeExitOffset(
  action: TalentSwipeAction,
  screenWidth: number,
  screenHeight: number,
): { readonly x: number; readonly y: number } {
  switch (action) {
    case 'like':
      return { x: screenWidth * 1.4, y: 0 };
    case 'pass':
      return { x: -screenWidth * 1.4, y: 0 };
    case 'bookmark':
      return { x: 0, y: -screenHeight * 0.9 };
  }
}

/**
 * Resolves a committed swipe from translation + velocity.
 * Up-swipe (bookmark) wins when vertical intent dominates.
 */
export function resolveSwipeAction(
  metrics: SwipeMetrics,
  config: SwipeEngineConfig,
): TalentSwipeAction | null {
  const { translationX: dx, translationY: dy, velocityX: vx, velocityY: vy } = metrics;
  const {
    screenWidth,
    screenHeight,
    thresholdRatio = DEFAULT_THRESHOLD_RATIO,
    velocityThreshold = DEFAULT_VELOCITY_THRESHOLD,
    upThresholdRatio = DEFAULT_UP_THRESHOLD_RATIO,
  } = config;

  const horizontalThreshold = screenWidth * thresholdRatio;
  const upThreshold = screenHeight * upThresholdRatio;

  const isUp =
    (dy < -upThreshold || vy < -velocityThreshold) &&
    Math.abs(dy) >= Math.abs(dx);

  if (isUp) {
    return 'bookmark';
  }
  if (dx > horizontalThreshold || vx > velocityThreshold) {
    return 'like';
  }
  if (dx < -horizontalThreshold || vx < -velocityThreshold) {
    return 'pass';
  }
  return null;
}
