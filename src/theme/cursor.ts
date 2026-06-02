/**
 * @file Cursor-inspired aesthetic tokens — The Stage
 * @description Minimal dark UI: hairline borders, vinotinto ambient glow, technical typography.
 */

import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

export const CursorColors = {
  bgAbsolute: '#0B0B0B',
  surface: '#16161A',
  surfaceTranslucent: 'rgba(22, 22, 26, 0.72)',
  accentVinotinto: '#7A0622',
  accentVinotintoSoft: 'rgba(122, 6, 34, 0.55)',
  accentGlow: 'rgba(122, 6, 34, 0.38)',
  accentGlowAmbient: 'rgba(122, 6, 34, 0.14)',
  accentBorder: 'rgba(122, 6, 34, 0.42)',
  textPrimary: 'rgba(255, 255, 255, 0.94)',
  textSecondary: '#A3A3A3',
  textFaint: 'rgba(255, 255, 255, 0.4)',
  borderHairline: 'rgba(255, 255, 255, 0.1)',
  borderFaint: 'rgba(255, 255, 255, 0.05)',
  overlayBottom: 'rgba(11, 11, 11, 0.55)',
  verified: 'rgba(74, 222, 128, 0.95)',
  pass: 'rgba(255, 100, 110, 0.85)',
} as const;

export const CursorSpacing = {
  xs: 8,
  sm: 14,
  md: 20,
  lg: 28,
  xl: 36,
} as const;

export const CursorTypography = {
  brand: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 11,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    color: CursorColors.textFaint,
  } as TextStyle,
  displayName: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 30,
    letterSpacing: 0.6,
    lineHeight: 36,
    color: CursorColors.textPrimary,
  } as TextStyle,
  subtitle: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 15,
    letterSpacing: 0.35,
    color: CursorColors.accentVinotintoSoft,
  } as TextStyle,
  body: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    letterSpacing: 0.2,
    lineHeight: 21,
    color: 'rgba(255, 255, 255, 0.72)',
  } as TextStyle,
  caption: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    letterSpacing: 0.15,
    color: CursorColors.textFaint,
  } as TextStyle,
  moduleLabel: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 10,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: CursorColors.textSecondary,
  } as TextStyle,
  stamp: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    color: CursorColors.textPrimary,
  } as TextStyle,
} as const;

export const CursorGlow = {
  cardAmbient: {
    shadowColor: CursorColors.accentVinotinto,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 48,
    elevation: 0,
  } as ViewStyle,
  interactive: {
    shadowColor: CursorColors.accentVinotinto,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 4,
  } as ViewStyle,
  tabActive: {
    shadowColor: CursorColors.accentVinotinto,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 0,
  } as ViewStyle,
};

export const CursorBorders = {
  hairline: StyleSheet.hairlineWidth,
  thin: 1,
  radiusSm: 10,
  radiusMd: 14,
  radiusLg: 18,
  radiusFull: 999,
};
