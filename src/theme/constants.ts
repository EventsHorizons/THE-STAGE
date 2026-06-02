/**
 * @file Design Tokens — The Stage (Cursor-minimal aesthetic)
 */

import { CursorBorders, CursorColors, CursorGlow, CursorSpacing, CursorTypography } from './cursor';

export const Colors = {
  background: CursorColors.bgAbsolute,
  surface: CursorColors.surface,
  surfaceSolid: CursorColors.surface,
  surfaceTranslucent: CursorColors.surfaceTranslucent,
  primaryAccent: CursorColors.accentVinotinto,
  secondaryAccent: CursorColors.accentVinotintoSoft,
  accentVinotinto: CursorColors.accentVinotinto,
  accentGlow: CursorColors.accentGlow,
  accentGlowAmbient: CursorColors.accentGlowAmbient,
  accentBorder: CursorColors.accentBorder,
  accentGradient: [
    CursorColors.accentVinotintoSoft,
    CursorColors.accentGlowAmbient,
  ] as const,
  text: CursorColors.textPrimary,
  textMuted: CursorColors.textSecondary,
  textFaint: CursorColors.textFaint,
  border: CursorColors.borderHairline,
  borderFaint: CursorColors.borderFaint,
  verified: CursorColors.verified,
};

export const Spacing = CursorSpacing;
export const Typography = CursorTypography;
export const Glow = CursorGlow;
export const Borders = CursorBorders;
