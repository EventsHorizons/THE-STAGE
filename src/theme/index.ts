/**
 * @file Design System Specification — "The Stage"
 * @description Street-Tech and Brutalist design tokens conforming to Golden Ratio
 * scaling metrics and perfect 8pt geometric structures.
 */

import { StyleSheet } from 'react-native';

// Spacing system based on 8pt Grid & Golden Ratio proportions (Φ = 1.618)
export const GOLDEN_RATIO = 1.61803398875;
export const BASE_SPACING = 8;

export const Spacing = {
  xs: BASE_SPACING,                  // 8px
  sm: Math.round(BASE_SPACING * GOLDEN_RATIO), // 13px
  md: BASE_SPACING * 2,              // 16px
  lg: Math.round(BASE_SPACING * 2 * GOLDEN_RATIO), // 26px
  xl: BASE_SPACING * 4,              // 32px
  xxl: Math.round(BASE_SPACING * 4 * GOLDEN_RATIO), // 52px
};

export const Colors = {
  // Absolute Brutalist dark grading
  bgAbsolute: '#0B0B0B',
  surfaceCharcoal: '#16161A',
  surfaceCharcoalMuted: '#1E1E24',
  
  // High-fidelity accent
  accentPrimary: '#5D2FFA',
  accentSecondary: '#8D27F2',
  accentBurgundy: '#A51364',
  accentBurgundyLight: '#C71E7A',
  accentGradient: ['#5D2FFA', '#8D27F2'],
  accentGlow: 'rgba(93, 47, 250, 0.45)',

  // Semantic labels
  textPrimary: '#FFFFFF',
  textSecondary: '#8E8E93',
  textMuted: '#55555A',
  borderDark: '#222226',
  
  // Special states
  verifiedGreen: '#00FF66',
  warningOrange: '#D44E11',
  overlayDark: 'rgba(11, 11, 11, 0.85)',
  bokehGlow: 'rgba(93, 47, 250, 0.15)',
};

export const Typography = {
  // Bold structural geometric headers (Outfit)
  headerLarge: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 32,
    fontWeight: '800' as const,
    letterSpacing: -1,
    lineHeight: 38,
    color: Colors.textPrimary,
  },
  headerMedium: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    lineHeight: 30,
    color: Colors.textPrimary,
  },
  headerSmall: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
    color: Colors.textPrimary,
  },
  bodyRegular: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  bodySmall: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    color: Colors.textSecondary,
  },
  labelCaps: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 10,
    fontWeight: '700' as const,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
    color: Colors.textPrimary,
  },
  technicalMetric: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 10,
    fontWeight: '700' as const,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
    color: Colors.accentPrimary,
  },
  actionLabel: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 14,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
    color: Colors.textPrimary,
  },
};

// Rembrandt Chiaroscuro Chiaroscuro shadows - extreme depth instead of solid lines
export const Shadows = {
  deepRembrandt: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.9,
    shadowRadius: 24,
    elevation: 20,
  },
  accentGlow: {
    shadowColor: Colors.accentPrimary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  microSubtle: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  }
};

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgAbsolute,
  },
  brutalistCard: {
    backgroundColor: Colors.surfaceCharcoal,
    borderRadius: 16,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    ...Shadows.deepRembrandt,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
});
