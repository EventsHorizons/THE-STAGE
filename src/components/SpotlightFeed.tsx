/**
 * @file SpotlightFeed Component — "The Stage"
 * @description Highly-optimized React Native discovery feed utilizing
 * paginated vertical scrolling (snapToInterval) and high-contrast Rembrandt overlays.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Colors, Spacing, Typography, Shadows } from '../theme';
import { ArtistUser } from '../types';

const { width, height } = Dimensions.get('window');
// Calculate active viewport height minus bottom bar offsets if any
const FEED_ITEM_HEIGHT = height - (StatusBar.currentHeight || 0);

interface SpotlightFeedProps {
  readonly profiles: readonly ArtistUser[];
  readonly onViewPortfolio: (profile: ArtistUser) => void;
  readonly onMatchTrigger: (profile: ArtistUser) => void;
}

export const SpotlightFeed: React.FC<SpotlightFeedProps> = ({
  profiles,
  onViewPortfolio,
  onMatchTrigger,
}) => {
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({});

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderFeedItem = ({ item }: { readonly item: ArtistUser }) => {
    const isBookmarked = !!bookmarkedIds[item.uuid];
    const firstImage = item.portfolio.find(m => m.type === 'image')?.uri || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000';

    return (
      <View style={styles.feedItem}>
        {/* Full-bleed photography/video placeholder */}
        <Image source={{ uri: firstImage }} style={styles.fullscreenMedia} resizeMode="cover" />
        
        {/* High-Contrast Rembrandt Shadow Overlays */}
        <View style={styles.topVignette} />
        <View style={styles.bottomVignette} />

        {/* Top Header info */}
        <View style={styles.topNavRow}>
          <Text style={styles.brandTitle}>THE STAGE</Text>
          <View style={styles.liveIndicator}>
            <View style={styles.pulseDot} />
            <Text style={styles.liveText}>SPOTLIGHT</Text>
          </View>
        </View>

        {/* Floating Right Actions Hub */}
        <View style={styles.actionHub}>
          <TouchableOpacity
            style={[styles.floatingActionBtn, isBookmarked ? styles.activeActionBtn : null]}
            activeOpacity={0.8}
            onPress={() => toggleBookmark(item.uuid)}
          >
            <Text style={styles.actionIcon}>{isBookmarked ? '★' : '☆'}</Text>
            <Text style={styles.actionMetric}>12.4k</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.floatingActionBtn} activeOpacity={0.8}>
            <Text style={styles.actionIcon}>⤻</Text>
            <Text style={styles.actionMetric}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.matchActionBtn, Shadows.accentGlow]}
            activeOpacity={0.85}
            onPress={() => onMatchTrigger(item)}
          >
            <Text style={styles.matchBtnIcon}>⚡</Text>
            <Text style={styles.matchBtnText}>MATCH</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Metadata Panel with High-Contrast blur overlays */}
        <View style={styles.bottomMetaPanel}>
          <View style={styles.metadataWrap}>
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredBadgeText}>ARTIST OF THE WEEK</Text>
            </View>
            <Text style={Typography.headerLarge}>{item.name}</Text>
            <Text style={styles.categorySub}>{item.technicalStats.primaryInstrumentOrGenre}</Text>
            
            <View style={styles.tagsContainer}>
              {item.technicalStats.skills.slice(0, 2).map((skill, idx) => (
                <View key={idx} style={styles.tagItem}>
                  <Text style={styles.tagText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* CTA Primary Action */}
          <TouchableOpacity
            style={[styles.viewPortfolioCTA, Shadows.accentGlow]}
            activeOpacity={0.8}
            onPress={() => onViewPortfolio(item)}
          >
            <Text style={Typography.actionLabel}>View Portfolio</Text>
            <Text style={styles.arrowCTA}>↗</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={profiles}
      renderItem={renderFeedItem}
      keyExtractor={item => item.uuid}
      pagingEnabled
      snapToInterval={FEED_ITEM_HEIGHT}
      snapToAlignment="start"
      decelerationRate="fast"
      showsVerticalScrollIndicator={false}
      style={styles.feedList}
    />
  );
};

const styles = StyleSheet.create({
  feedList: {
    backgroundColor: Colors.bgAbsolute,
  },
  feedItem: {
    width: width,
    height: FEED_ITEM_HEIGHT,
    position: 'relative',
    backgroundColor: '#000',
  },
  fullscreenMedia: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.85,
  },
  topVignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  bottomVignette: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 380,
    backgroundColor: 'rgba(9, 9, 10, 0.85)',
  },
  topNavRow: {
    position: 'absolute',
    top: Spacing.xl,
    left: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  brandTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(93, 47, 250, 0.2)',
    borderWidth: 1,
    borderColor: Colors.accentPrimary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
    backgroundColor: '#00FF66',
    borderRadius: 3,
    marginRight: 6,
  },
  liveText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },
  actionHub: {
    position: 'absolute',
    right: Spacing.md,
    bottom: 230,
    alignItems: 'center',
    gap: Spacing.md,
    zIndex: 10,
  },
  floatingActionBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(22, 22, 26, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeActionBtn: {
    borderColor: Colors.accentSecondary,
    backgroundColor: Colors.accentPrimary,
  },
  actionIcon: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  actionMetric: {
    color: Colors.textSecondary,
    fontSize: 8,
    fontWeight: '700',
    marginTop: 2,
  },
  matchActionBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.accentPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchBtnIcon: {
    color: '#FFF',
    fontSize: 16,
  },
  matchBtnText: {
    color: '#FFF',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  bottomMetaPanel: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: Spacing.md,
    right: Spacing.md,
    zIndex: 10,
  },
  metadataWrap: {
    marginBottom: Spacing.md,
  },
  featuredBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accentBurgundy,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 6,
  },
  featuredBadgeText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },
  categorySub: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 6,
    marginTop: Spacing.sm,
  },
  tagItem: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  tagText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '600',
  },
  viewPortfolioCTA: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: Colors.accentBurgundy,
    borderRadius: 16,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  arrowCTA: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
