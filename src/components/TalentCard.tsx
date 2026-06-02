/**
 * @file TalentCard — floating discover card (Cursor-minimal)
 */

import React, { memo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Pressable,
  Animated,
} from 'react-native';
import { Search, ArrowUpRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Typography, Glow, Borders } from '../theme/constants';
import { ArtistProfile } from '../types';
import type { TalentSwipeAction } from '../navigation/types';
import { useSwipeGesture } from '../hooks/useSwipeGesture';
import { ActionButtons } from './ActionButtons';
import { CategoryChips } from './CategoryChips';

const { width, height } = Dimensions.get('window');
const CARD_INSET = 10;

interface TalentCardProps {
  readonly artist: ArtistProfile;
  readonly isTopCard: boolean;
  readonly onSwipeComplete: (action: TalentSwipeAction) => void;
  readonly onTap: () => void;
}

export const TalentCard = memo(function TalentCard({
  artist,
  isTopCard,
  onSwipeComplete,
  onTap,
}: TalentCardProps) {
  const handleComplete = (action: TalentSwipeAction) => {
    onSwipeComplete(action);
  };

  const {
    cardStyle,
    panHandlers,
    likeOpacity,
    passOpacity,
    bookmarkOpacity,
    handleTap,
  } = useSwipeGesture({
    enabled: isTopCard,
    onSwipeComplete: handleComplete,
    onTap,
  });

  const skills = [
    artist.displayCategory ?? artist.category,
    artist.stats?.instrument,
    artist.location?.city,
  ].filter((s): s is string => Boolean(s));

  const triggerAction = (action: TalentSwipeAction) => {
    if (!isTopCard) return;
    handleComplete(action);
  };

  const stackScale = isTopCard ? 1 : 0.97;
  const stackTranslateY = isTopCard ? 0 : 10;

  return (
    <Animated.View
      style={[
        styles.outer,
        {
          zIndex: isTopCard ? 2 : 1,
          transform: [{ scale: stackScale }, { translateY: stackTranslateY }],
        },
        isTopCard ? cardStyle : undefined,
      ]}
      {...(isTopCard ? panHandlers : {})}
    >
      {isTopCard ? <View style={styles.ambientGlow} pointerEvents="none" /> : null}

      <View style={[styles.cardFrame, isTopCard && styles.cardFrameActive]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleTap}>
          <Image
            source={{ uri: artist.avatarUrl }}
            style={styles.backgroundMedia}
            resizeMode="cover"
          />
        </Pressable>

        <LinearGradient
          colors={['transparent', 'rgba(11,11,11,0.15)', 'rgba(11,11,11,0.88)']}
          locations={[0, 0.55, 1]}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        />

        {isTopCard ? (
          <>
            <Animated.View style={[styles.stamp, styles.stampLike, { opacity: likeOpacity }]}>
              <Text style={styles.stampText}>Conectar</Text>
            </Animated.View>
            <Animated.View style={[styles.stamp, styles.stampPass, { opacity: passOpacity }]}>
              <Text style={styles.stampText}>Pasar</Text>
            </Animated.View>
            <Animated.View style={[styles.stamp, styles.stampUp, { opacity: bookmarkOpacity }]}>
              <Text style={styles.stampText}>Guardar</Text>
            </Animated.View>
          </>
        ) : null}

        <View style={styles.topBar} pointerEvents="box-none">
          <Text style={styles.brandText}>The Stage</Text>
          <View style={styles.topTabs}>
            <TouchableOpacity style={styles.topTabActive}>
              <Text style={styles.topTabTextActive}>Trending</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.topTab}>
              <Text style={styles.topTabText}>Nearby</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.searchBtn}>
            <Search size={18} color={Colors.textFaint} strokeWidth={1.5} />
          </TouchableOpacity>
        </View>

        {isTopCard ? <ActionButtons onAction={triggerAction} /> : null}

        <View style={styles.artistInfo} pointerEvents="box-none">
          <Text style={styles.eyebrow}>Spotlight</Text>
          <Text style={styles.artistName}>{artist.name}</Text>
          <Text style={styles.artistCategory}>
            {artist.displayCategory ?? artist.category}
          </Text>
          {artist.location?.city ? (
            <Text style={styles.locationText}>{artist.location.city}</Text>
          ) : null}
          <CategoryChips items={skills} maxVisible={4} />
          <Text style={styles.artistBio} numberOfLines={2}>
            {artist.bio}
          </Text>
          {artist.availability ? (
            <Text style={styles.availability}>Disponible</Text>
          ) : null}

          <TouchableOpacity style={styles.mainCta} onPress={onTap} activeOpacity={0.75}>
            <Text style={styles.mainCtaText}>Ver portafolio</Text>
            <ArrowUpRight size={14} color={Colors.textMuted} strokeWidth={1.5} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  outer: {
    ...StyleSheet.absoluteFillObject,
    width,
    height,
    paddingHorizontal: CARD_INSET,
    paddingTop: CARD_INSET,
    paddingBottom: CARD_INSET + 72,
  },
  ambientGlow: {
    position: 'absolute',
    top: '12%',
    left: '8%',
    right: '8%',
    bottom: '18%',
    borderRadius: Borders.radiusLg,
    backgroundColor: Colors.accentGlowAmbient,
    ...Glow.cardAmbient,
  },
  cardFrame: {
    flex: 1,
    borderRadius: Borders.radiusLg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderFaint,
    backgroundColor: Colors.background,
  },
  cardFrameActive: {
    borderColor: Colors.border,
    ...Glow.interactive,
  },
  backgroundMedia: {
    ...StyleSheet.absoluteFillObject,
  },
  stamp: {
    position: 'absolute',
    top: 100,
    zIndex: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Borders.radiusSm,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(11, 11, 11, 0.4)',
  },
  stampLike: {
    left: 28,
    borderColor: Colors.verified,
    transform: [{ rotate: '-8deg' }],
  },
  stampPass: {
    right: 28,
    borderColor: Colors.pass,
    transform: [{ rotate: '8deg' }],
  },
  stampUp: {
    alignSelf: 'center',
    left: width / 2 - 52,
    borderColor: Colors.accentBorder,
  },
  stampText: {
    ...Typography.stamp,
  },
  topBar: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    zIndex: 10,
  },
  brandText: {
    ...Typography.brand,
  },
  topTabs: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  topTabActive: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.accentBorder,
    paddingBottom: 6,
  },
  topTab: {
    paddingBottom: 6,
  },
  topTabTextActive: {
    ...Typography.caption,
    color: Colors.text,
    letterSpacing: 0.5,
  },
  topTabText: {
    ...Typography.caption,
  },
  searchBtn: {
    padding: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    borderRadius: Borders.radiusFull,
  },
  artistInfo: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: Spacing.md,
    right: 72,
    gap: Spacing.xs,
  },
  eyebrow: {
    ...Typography.moduleLabel,
    color: Colors.textFaint,
  },
  artistName: {
    ...Typography.displayName,
  },
  artistCategory: {
    ...Typography.subtitle,
  },
  locationText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  artistBio: {
    ...Typography.body,
    marginTop: 4,
  },
  availability: {
    ...Typography.caption,
    color: Colors.verified,
    letterSpacing: 0.8,
  },
  mainCta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    gap: 6,
    borderRadius: Borders.radiusFull,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  mainCtaText: {
    ...Typography.caption,
    color: Colors.textMuted,
    letterSpacing: 0.6,
  },
});
