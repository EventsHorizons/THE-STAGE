/**
 * @file TalentCard — "The Stage"
 * @description Full-screen discover card with swipe engine, overlay info, and action rail.
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
import { Search, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing } from '../theme/constants';
import { ArtistProfile } from '../types';
import type { TalentSwipeAction } from '../navigation/types';
import { useSwipeGesture } from '../hooks/useSwipeGesture';
import { ActionButtons } from './ActionButtons';
import { CategoryChips } from './CategoryChips';

const { width, height } = Dimensions.get('window');

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

  const stackScale = isTopCard ? 1 : 0.96;
  const stackTranslateY = isTopCard ? 0 : 12;

  return (
    <Animated.View
      style={[
        styles.feedItem,
        {
          zIndex: isTopCard ? 2 : 1,
          transform: [{ scale: stackScale }, { translateY: stackTranslateY }],
        },
        isTopCard ? cardStyle : undefined,
      ]}
      {...(isTopCard ? panHandlers : {})}
    >
      <Pressable style={StyleSheet.absoluteFill} onPress={handleTap}>
        <Image
          source={{ uri: artist.avatarUrl }}
          style={styles.backgroundMedia}
          resizeMode="cover"
        />
      </Pressable>

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.85)']}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />

      {isTopCard ? (
        <>
          <Animated.View style={[styles.stamp, styles.stampLike, { opacity: likeOpacity }]}>
            <Text style={styles.stampText}>CONECTAR</Text>
          </Animated.View>
          <Animated.View style={[styles.stamp, styles.stampPass, { opacity: passOpacity }]}>
            <Text style={styles.stampText}>PASAR</Text>
          </Animated.View>
          <Animated.View style={[styles.stamp, styles.stampUp, { opacity: bookmarkOpacity }]}>
            <Text style={styles.stampText}>GUARDAR</Text>
          </Animated.View>
        </>
      ) : null}

      <View style={styles.topBar} pointerEvents="box-none">
        <Text style={styles.brandText}>THE STAGE</Text>
        <View style={styles.topTabs}>
          <TouchableOpacity style={styles.topTabActive}>
            <Text style={styles.topTabTextActive}>Trending</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.topTab}>
            <Text style={styles.topTabText}>Nearby</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.searchBtn}>
          <Search size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      {isTopCard ? (
        <ActionButtons onAction={triggerAction} />
      ) : null}

      <View style={styles.artistInfo} pointerEvents="box-none">
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>SPOTLIGHT ARTIST</Text>
        </View>
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
          <Text style={styles.availability}>Disponible ahora</Text>
        ) : null}

        <TouchableOpacity style={styles.mainCta} onPress={onTap}>
          <Text style={styles.mainCtaText}>Ver Portafolio</Text>
          <Zap size={16} color="#FFF" fill="#FFF" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  feedItem: {
    ...StyleSheet.absoluteFillObject,
    width,
    height,
  },
  backgroundMedia: {
    ...StyleSheet.absoluteFillObject,
  },
  stamp: {
    position: 'absolute',
    top: 120,
    zIndex: 20,
    borderWidth: 3,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  stampLike: {
    left: 24,
    borderColor: Colors.verified,
    transform: [{ rotate: '-12deg' }],
  },
  stampPass: {
    right: 24,
    borderColor: '#FF4458',
    transform: [{ rotate: '12deg' }],
  },
  stampUp: {
    alignSelf: 'center',
    left: width / 2 - 60,
    borderColor: Colors.primaryAccent,
  },
  stampText: {
    color: '#FFF',
    fontSize: 22,
    fontFamily: 'Outfit_800ExtraBold',
    letterSpacing: 2,
  },
  topBar: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    zIndex: 10,
  },
  brandText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Outfit_800ExtraBold',
    letterSpacing: 1.5,
  },
  topTabs: {
    flexDirection: 'row',
    gap: 16,
  },
  topTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#FFF',
    paddingBottom: 4,
  },
  topTab: {
    paddingBottom: 4,
  },
  topTabTextActive: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Outfit_700Bold',
  },
  topTabText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontFamily: 'Outfit_600SemiBold',
  },
  searchBtn: {
    padding: 4,
  },
  artistInfo: {
    position: 'absolute',
    bottom: 120,
    left: Spacing.md,
    right: 80,
    gap: 6,
  },
  badgeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontFamily: 'Outfit_800ExtraBold',
    letterSpacing: 1,
  },
  artistName: {
    color: '#FFF',
    fontSize: 32,
    fontFamily: 'Outfit_800ExtraBold',
    letterSpacing: -0.5,
  },
  artistCategory: {
    color: Colors.primaryAccent,
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
    marginTop: -4,
  },
  locationText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontFamily: 'Outfit_600SemiBold',
  },
  artistBio: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    lineHeight: 20,
  },
  availability: {
    color: Colors.verified,
    fontSize: 12,
    fontFamily: 'Outfit_600SemiBold',
  },
  mainCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    gap: 8,
    marginTop: 8,
  },
  mainCtaText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Outfit_700Bold',
  },
});
