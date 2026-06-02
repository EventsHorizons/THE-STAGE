/**
 * @file BentoGridShowcase Component — "The Stage"
 * @description Modular React Native profile component using brutalist bento layout.
 * Uses ArtistUser type and design tokens from theme/index.ts.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Colors, Spacing, Typography, Shadows, GlobalStyles, GOLDEN_RATIO } from '../theme';
import { ArtistUser } from '../types';

const { width } = Dimensions.get('window');

interface BentoGridShowcaseProps {
  readonly profile: ArtistUser;
  readonly onInviteToCasting: () => void;
}

export const BentoGridShowcase: React.FC<BentoGridShowcaseProps> = ({
  profile,
  onInviteToCasting,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const profileStats = profile.technicalStats as Record<string, unknown> | undefined;
  const heroHeight = Math.round(width * GOLDEN_RATIO * 0.65);
  const firstImage = profile.portfolio?.find(m => m.type === 'image')?.uri
    || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000';
  const profileLocation = profile.location ? `${profile.location.city}, ${profile.location.country}` : 'Unknown';
  const profileFeature = typeof profileStats?.primaryInstrumentOrGenre === 'string'
    ? profileStats.primaryInstrumentOrGenre
    : typeof profileStats?.instrument === 'string'
      ? profileStats.instrument
      : 'Live Session';
  const profileExperience = typeof profileStats?.experienceYears === 'number'
    ? `${profileStats.experienceYears} yrs`
    : '—';
  const profileRating = typeof profileStats?.overallRating === 'number'
    ? `★ ${profileStats.overallRating}`
    : '★ 4.9';
  const profileHeight = profile.biometricData?.heightCm ? `${profile.biometricData.heightCm} cm` : '—';

  return (
    <View style={GlobalStyles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO CONTAINER */}
        <View style={[styles.heroContainer, { height: heroHeight }]}>
          <Image
            source={{ uri: firstImage }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          {/* Bokeh orbs as plain opacity layers (no CSS filter) */}
          <View style={styles.bokehOrb1} />
          <View style={styles.bokehOrb2} />

          {/* Rembrandt vignette — solid overlay */}
          <View style={styles.heroOverlay} />

          {/* Status badge */}
          <View style={styles.statusBadge}>
            <View style={styles.activeDot} />
            <Text style={styles.statusText}>LIVE PORTFOLIO</Text>
          </View>

          {/* Name & location overlay */}
          <View style={styles.heroMeta}>
            <Text style={Typography.headerLarge}>{profile.name}</Text>
            <View style={styles.locationRow}>
              <Text style={styles.locationText}>
                {profileLocation}
              </Text>
              {profile.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>VERIFIED</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* BENTO GRID */}
        <View style={styles.bentoContainer}>

          {/* Card 1: Audio Player — full width */}
          <View style={[styles.bentoCard, styles.fullWidth, Shadows.deepRembrandt]}>
            <Text style={Typography.technicalMetric}>FEATURED PERFORMANCE</Text>
            <Text style={styles.mediaTitle}>
              {profileFeature} — Studio Session
            </Text>

            {/* Waveform */}
            <View style={styles.waveformContainer}>
              <View style={styles.waveformProgress} />
              <View style={styles.waveformBars}>
                {[20,45,60,30,80,95,40,70,20,85,60,40,90,35,60,75,50,85,30,65,45,70,30,50].map(
                  (h, i) => (
                    <View
                      key={i}
                      style={[
                        styles.waveBar,
                        { height: h * 0.28 },
                        isPlaying && i < 12 ? styles.waveBarActive : null,
                      ]}
                    />
                  )
                )}
              </View>
            </View>

            <View style={styles.playerRow}>
              <Text style={styles.timeStamp}>01:14</Text>
              <TouchableOpacity
                style={styles.playBtn}
                activeOpacity={0.8}
                onPress={() => setIsPlaying(!isPlaying)}
              >
                <Text style={styles.playBtnText}>{isPlaying ? '⏸' : '▶'}</Text>
              </TouchableOpacity>
              <Text style={styles.timeStamp}>03:42</Text>
            </View>
          </View>

          {/* Card 2: Technical Stats */}
          <View style={[styles.bentoCard, styles.halfWidth, Shadows.deepRembrandt]}>
            <Text style={Typography.technicalMetric}>STATS</Text>
            <View style={styles.statList}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Experience</Text>
                <Text style={styles.statValue}>{profileExperience}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Rating</Text>
                <Text style={styles.statValue}>{profileRating}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Height</Text>
                <Text style={styles.statValue}>{profileHeight}</Text>
              </View>
            </View>
          </View>

          {/* Card 3: Social Connections */}
          <View style={[styles.bentoCard, styles.halfWidth, Shadows.deepRembrandt]}>
            <Text style={Typography.technicalMetric}>PLATFORMS</Text>
            <View style={styles.socialGrid}>
              {(['Spotify', 'YouTube', 'IMDb', 'Instagram'] as const).map(p => (
                <View key={p} style={styles.socialBadge}>
                  <Text style={styles.socialBadgeText}>{p}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Card 4: Bio — full width */}
          <View style={[styles.bentoCard, styles.fullWidth, Shadows.deepRembrandt]}>
            <Text style={Typography.technicalMetric}>BIOGRAPHY</Text>
            <Text style={styles.bioText}>{profile.bio}</Text>
          </View>

        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View style={styles.stickyFooter}>
        <TouchableOpacity
          style={[styles.castingBtn, Shadows.accentGlow]}
          activeOpacity={0.8}
          onPress={onInviteToCasting}
        >
          <Text style={Typography.actionLabel}>Invite to Casting</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 96,
  },
  heroContainer: {
    width: '100%',
    backgroundColor: '#000',
    overflow: 'hidden',
    position: 'relative',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9, 9, 10, 0.5)',
  },
  bokehOrb1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.accentPrimary,
    opacity: 0.12,
    top: '20%',
    left: '5%',
  },
  bokehOrb2: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.warningOrange,
    opacity: 0.10,
    bottom: '10%',
    right: '2%',
  },
  statusBadge: {
    position: 'absolute',
    top: Spacing.lg,
    left: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.verifiedGreen,
    marginRight: 6,
  },
  statusText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  heroMeta: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.md,
    right: Spacing.md,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  verifiedBadge: {
    marginLeft: 8,
    backgroundColor: Colors.accentPrimary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  bentoContainer: {
    padding: Spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bentoCard: {
    backgroundColor: Colors.surfaceCharcoal,
    borderRadius: 16,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    marginBottom: Spacing.xs,
  },
  fullWidth: {
    width: '100%',
  },
  halfWidth: {
    width: '48%',
  },
  mediaTitle: {
    color: Colors.textPrimary,
    fontWeight: '700',
    fontSize: 13,
    marginTop: 4,
    marginBottom: Spacing.xs,
  },
  waveformContainer: {
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginBottom: Spacing.xs,
  },
  waveformProgress: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '40%',
    height: '100%',
    backgroundColor: 'rgba(122, 6, 34, 0.12)',
    borderRightWidth: 1.5,
    borderRightColor: Colors.accentBurgundy,
  },
  waveformBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  waveBar: {
    width: 3,
    backgroundColor: Colors.textMuted,
    borderRadius: 1.5,
  },
  waveBarActive: {
    backgroundColor: Colors.accentBurgundyLight,
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeStamp: {
    fontSize: 9,
    color: Colors.textMuted,
  },
  playBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.accentBurgundy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnText: {
    color: '#FFF',
    fontSize: 12,
  },
  statList: {
    marginTop: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 10,
  },
  statValue: {
    color: Colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  socialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  socialBadge: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderRadius: 6,
    width: '48%',
    alignItems: 'center',
    marginBottom: 4,
    marginRight: '2%',
  },
  socialBadgeText: {
    color: Colors.textSecondary,
    fontSize: 9,
    fontWeight: '600',
  },
  bioText: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.bgAbsolute,
    borderTopWidth: 1,
    borderTopColor: Colors.borderDark,
  },
  castingBtn: {
    width: '100%',
    backgroundColor: Colors.accentBurgundy,
    borderRadius: 30,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
