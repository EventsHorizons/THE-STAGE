/**
 * @file MultimediaCarousel — "The Stage"
 * @description Short videobook carousel (up to 7 clips) + supporting images.
 */

import React, { useState } from 'react';
import {
  View,
  Image,
  ScrollView,
  Dimensions,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import type { MediaAsset } from '../types';
import { Colors, Spacing } from '../theme/constants';

const { width } = Dimensions.get('window');
const SLIDE_WIDTH = width - Spacing.md * 2;

interface MultimediaCarouselProps {
  readonly items: readonly MediaAsset[];
  readonly maxVideos?: number;
}

export const MultimediaCarousel: React.FC<MultimediaCarouselProps> = ({
  items,
  maxVideos = 7,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = items.slice(0, maxVideos);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SLIDE_WIDTH);
    setActiveIndex(index);
  };

  if (slides.length === 0) {
    return <View style={styles.empty} />;
  }

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={SLIDE_WIDTH}
      >
        {slides.map((item, index) => (
          <View key={`${item.url}-${index}`} style={styles.slide}>
            <Image source={{ uri: item.url ?? item.uri }} style={styles.media} resizeMode="cover" />
          </View>
        ))}
      </ScrollView>
      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  slide: {
    width: SLIDE_WIDTH,
    height: SLIDE_WIDTH * 1.2,
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: Spacing.md,
    backgroundColor: Colors.surface,
  },
  media: {
    width: '100%',
    height: '100%',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: Spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
  },
  dotActive: {
    backgroundColor: Colors.primaryAccent,
    width: 18,
  },
  empty: {
    height: 120,
    marginHorizontal: Spacing.md,
    borderRadius: 16,
    backgroundColor: Colors.surface,
  },
});
