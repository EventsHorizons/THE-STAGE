/**
 * @file Design System — The Stage (Cursor-minimal)
 */

import { StyleSheet } from 'react-native';
import { CursorColors, CursorGlow, CursorSpacing, CursorTypography } from './cursor';

export * from './cursor';
export { Colors, Spacing, Typography, Glow, Borders } from './constants';

export const GOLDEN_RATIO = 1.61803398875;
export const BASE_SPACING = 8;

export const ColorsLegacy = {
  bgAbsolute: CursorColors.bgAbsolute,
  surfaceCharcoal: CursorColors.surface,
  surfaceCharcoalMuted: 'rgba(30, 30, 36, 0.65)',
  accentPrimary: CursorColors.accentVinotinto,
  accentSecondary: CursorColors.accentVinotintoSoft,
  accentGradient: [CursorColors.accentVinotintoSoft, CursorColors.accentGlowAmbient],
  accentGlow: CursorColors.accentGlow,
  textPrimary: CursorColors.textPrimary,
  textSecondary: CursorColors.textSecondary,
  textMuted: CursorColors.textFaint,
  borderDark: CursorColors.borderHairline,
  verifiedGreen: CursorColors.verified,
  warningOrange: '#D44E11',
  overlayDark: CursorColors.overlayBottom,
  bokehGlow: CursorColors.accentGlowAmbient,
};

export const SpacingLegacy = {
  xs: BASE_SPACING,
  sm: Math.round(BASE_SPACING * GOLDEN_RATIO),
  md: BASE_SPACING * 2,
  lg: Math.round(BASE_SPACING * 2 * GOLDEN_RATIO),
  xl: BASE_SPACING * 4,
  xxl: Math.round(BASE_SPACING * 4 * GOLDEN_RATIO),
};

export const TypographyLegacy = {
  headerLarge: CursorTypography.displayName,
  headerMedium: {
    ...CursorTypography.displayName,
    fontSize: 24,
    lineHeight: 30,
  },
  headerSmall: {
    ...CursorTypography.subtitle,
    fontSize: 18,
  },
  bodyRegular: CursorTypography.body,
  bodySmall: CursorTypography.caption,
  labelCaps: CursorTypography.moduleLabel,
};

export const Shadows = {
  deepRembrandt: CursorGlow.cardAmbient,
  accentGlow: CursorGlow.interactive,
  microSubtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
};

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CursorColors.bgAbsolute,
  },
  brutalistCard: {
    backgroundColor: CursorColors.surfaceTranslucent,
    borderRadius: CursorSpacing.sm,
    padding: CursorSpacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CursorColors.borderHairline,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
