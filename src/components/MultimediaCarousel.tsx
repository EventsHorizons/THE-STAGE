/**
 * @file MultimediaCarousel — lazy-loaded slides (expo-image), max 7 items
 */

import React, { useState, useCallback, memo } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Image } from 'expo-image';
import type { MediaAsset } from '../types';
import { Colors, Spacing } from '../theme/constants';
import { MAX_MEDIA_PER_PROFILE } from '../types/models';
import { useMediaCleanup } from '../hooks/useMediaCleanup';

const { width } = Dimensions.get('window');
const SLIDE_WIDTH = width - Spacing.md * 2;

interface SlideProps {
  readonly item: MediaAsset;
  readonly index: number;
  readonly isNearViewport: boolean;
}

const CarouselSlide = memo(function CarouselSlide({
  item,
  index,
  isNearViewport,
}: SlideProps) {
  const uri = item.url ?? item.uri;
  if (!isNearViewport || !uri) {
    return <View style={styles.slide} />;
  }

  return (
    <View style={styles.slide}>
      <Image
        source={{ uri }}
        style={styles.media}
        contentFit="cover"
        cachePolicy="memory-disk"
        recyclingKey={`carousel-${uri}-${index}`}
        transition={200}
      />
    </View>
  );
});

interface MultimediaCarouselProps {
  readonly items: readonly MediaAsset[];
  readonly maxVideos?: number;
}

export const MultimediaCarousel: React.FC<MultimediaCarouselProps> = ({
  items,
  maxVideos = MAX_MEDIA_PER_PROFILE,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = items.slice(0, maxVideos);
  const { registerCleanup } = useMediaCleanup();

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SLIDE_WIDTH);
    setActiveIndex(index);
  }, []);

  React.useEffect(() => {
    registerCleanup(() => {
      void Image.clearMemoryCache();
    });
  }, [registerCleanup]);

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
        removeClippedSubviews
      >
        {slides.map((item, index) => (
          <CarouselSlide
            key={`${item.url ?? item.uri}-${index}`}
            item={item}
            index={index}
            isNearViewport={Math.abs(index - activeIndex) <= 1}
          />
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
    height: 2,
    borderRadius: 1,
    backgroundColor: Colors.borderFaint,
  },
  dotActive: {
    backgroundColor: Colors.accentVinotinto,
    width: 16,
    height: 2,
    borderRadius: 1,
  },
  empty: {
    height: 120,
    marginHorizontal: Spacing.md,
    borderRadius: 16,
    backgroundColor: Colors.surface,
  },
});
