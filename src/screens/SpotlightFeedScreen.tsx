/**
 * @file SpotlightFeedScreen — "The Stage"
 * @description Discovery feed utilizing vertical snap FlatLists and overlays.
 */

import React, { memo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Bookmark, Share2, Zap, Search } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing } from '../theme/constants';
import { PrimaryButton } from '../components/PrimaryButton';
import { ArtistProfile } from '../types';
import { useCasting } from '../hooks/useCasting';
import { useStageStore } from '../store/useStageStore';

const { width, height } = Dimensions.get('window');

interface SpotlightFeedScreenProps {
  readonly route?: any;
  readonly navigation: any;
  readonly artists?: readonly ArtistProfile[];
}

const FeedItem = memo(({ item, navigation, onMatch }: { item: ArtistProfile, navigation: any, onMatch: (a: ArtistProfile) => void }) => (
  <View style={styles.feedItem}>
    {/* Full Screen Image */}
    <Image source={{ uri: item.avatarUrl }} style={styles.backgroundMedia} resizeMode="cover" />

    {/* Subtle Dark Gradient Overlay */}
    <LinearGradient
      colors={['transparent', 'rgba(0,0,0,0.8)']}
      style={StyleSheet.absoluteFillObject}
    />

    {/* Top Minimalist Header */}
    <View style={styles.topBar}>
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

    {/* Floating Tinder-style Actions */}
    <View style={styles.rightActions}>
      <TouchableOpacity style={styles.actionCircle}>
        <Bookmark size={24} color="#FFF" />
        <Text style={styles.actionLabel}>12k</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionCircle}>
        <Share2 size={24} color="#FFF" />
        <Text style={styles.actionLabel}>3k</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.matchCircleWrapper}
        onPress={() => onMatch(item)}
      >
        <LinearGradient
          colors={Colors.accentGradient}
          style={styles.matchCircle}
        >
          <Zap size={28} color="#FFF" fill="#FFF" />
          <Text style={styles.matchText}>MATCH</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>

    {/* Artist Bottom Information */}
    <View style={styles.artistInfo}>
      <View style={styles.badgeContainer}>
        <Text style={styles.badgeText}>SPOTLIGHT ARTIST</Text>
      </View>
      <Text style={styles.artistName}>{item.name}</Text>
      <Text style={styles.artistCategory}>{item.displayCategory ?? item.category}</Text>
      <Text style={styles.artistBio} numberOfLines={2}>
        {item.bio}
      </Text>

      <TouchableOpacity 
        style={styles.mainCta}
        onPress={() => navigation.navigate('ArtistProfile', { artist: item })}
      >
        <Text style={styles.mainCtaText}>Ver Portafolio</Text>
        <Zap size={16} color="#FFF" fill="#FFF" />
      </TouchableOpacity>
    </View>
  </View>
));

export const SpotlightFeedScreen: React.FC<SpotlightFeedScreenProps> = ({
  navigation,
}) => {
  const { activeTalentFeed } = useStageStore();
  const { handleSwipeRight } = useCasting();

  const renderItem = ({ item }: { readonly item: ArtistProfile }) => (
    <FeedItem 
      item={item} 
      navigation={navigation} 
      onMatch={handleSwipeRight} 
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={activeTalentFeed}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        pagingEnabled
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        initialNumToRender={2}
        maxToRenderPerBatch={3}
        windowSize={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  feedItem: {
    width: width,
    height: height,
    position: 'relative',
  },
  backgroundMedia: {
    ...StyleSheet.absoluteFillObject,
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
  rightActions: {
    position: 'absolute',
    right: 12,
    bottom: 140,
    gap: 20,
    alignItems: 'center',
  },
  actionCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  actionLabel: {
    color: '#FFF',
    fontSize: 11,
    fontFamily: 'Outfit_700Bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  matchCircleWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFF',
    elevation: 10,
    shadowColor: Colors.primaryAccent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  matchCircle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchText: {
    color: '#FFF',
    fontSize: 8,
    fontFamily: 'Outfit_800ExtraBold',
    marginTop: -2,
  },
  artistInfo: {
    position: 'absolute',
    bottom: 120,
    left: Spacing.md,
    right: 80,
    gap: 8,
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
  artistBio: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    lineHeight: 20,
    marginTop: 4,
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
    marginTop: 12,
  },
  mainCtaText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Outfit_700Bold',
  },
});
