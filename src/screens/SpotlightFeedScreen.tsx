/**
 * @file SpotlightFeedScreen — Discover swipe stack
 */

import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../theme/constants';
import { TalentCard } from '../components/TalentCard';
import { EmptyState } from '../components/EmptyState';
import { ToastAlerts } from '../components/ToastAlerts';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { useCasting } from '../hooks/useCasting';
import { useDiscoverFeedState } from '../store/selectors';
import type { DiscoverTabNavigationProp, TalentSwipeAction } from '../navigation/types';
import type { ArtistProfile } from '../types';

const { height } = Dimensions.get('window');

export const SpotlightFeedScreen: React.FC = () => {
  const navigation = useNavigation<DiscoverTabNavigationProp>();
  const { current, next, isLoading, loadTalentFeed } = useDiscoverFeedState();
  const { handleSwipeRight, handleSwipeLeft, handleSwipeUp, recentMatch, clearRecentMatch } =
    useCasting();
  const [matchToast, setMatchToast] = useState<string | null>(null);

  useEffect(() => {
    if (recentMatch) {
      setMatchToast('¡Match mutuo! Podéis iniciar conversación.');
      clearRecentMatch();
    }
  }, [recentMatch, clearRecentMatch]);

  const openProfile = useCallback(
    (artist: ArtistProfile) => {
      navigation.navigate('TalentDetail', {
        profileId: artist.id,
        artist,
        fromTab: 'Discover',
      });
    },
    [navigation],
  );

  const onSwipeComplete = useCallback(
    async (action: TalentSwipeAction, artist: ArtistProfile) => {
      if (action === 'like') {
        await handleSwipeRight(artist);
        setMatchToast(`Interés enviado a ${artist.name}`);
      } else if (action === 'pass') {
        await handleSwipeLeft(artist);
      } else {
        await handleSwipeUp(artist);
        setMatchToast(`${artist.name} guardado en destacados`);
      }
    },
    [handleSwipeLeft, handleSwipeRight, handleSwipeUp],
  );

  if (isLoading && !current) {
    return <SkeletonLoader variant="card" />;
  }

  if (!current) {
    return (
      <EmptyState
        title="No hay más talento"
        message="Has visto todos los perfiles del feed. Vuelve más tarde o explora por categorías."
        actionLabel="Recargar feed"
        onAction={() => void loadTalentFeed()}
      />
    );
  }

  return (
    <View style={styles.container}>
      {next ? (
        <TalentCard
          key={next.id}
          artist={next}
          isTopCard={false}
          onSwipeComplete={() => undefined}
          onTap={() => openProfile(next)}
        />
      ) : null}

      <TalentCard
        key={current.id}
        artist={current}
        isTopCard
        onSwipeComplete={(action) => void onSwipeComplete(action, current)}
        onTap={() => openProfile(current)}
      />

      <ToastAlerts
        visible={Boolean(matchToast)}
        message={matchToast ?? ''}
        variant="match"
        onHide={() => setMatchToast(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height,
    backgroundColor: Colors.background,
  },
});
