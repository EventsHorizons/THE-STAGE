/**
 * @file SpotlightFeedScreen — "The Stage"
 * @description Discover stack: Tinder-style swipe cards with tap-to-profile.
 */

import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../theme/constants';
import { TalentCard } from '../components/TalentCard';
import { EmptyState } from '../components/EmptyState';
import { ToastAlerts } from '../components/ToastAlerts';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { useCasting } from '../hooks/useCasting';
import { useStageStore } from '../store/useStageStore';
import type { DiscoverTabNavigationProp, TalentSwipeAction } from '../navigation/types';
import type { ArtistProfile } from '../types';

const { height } = Dimensions.get('window');

export const SpotlightFeedScreen: React.FC = () => {
  const navigation = useNavigation<DiscoverTabNavigationProp>();
  const { activeTalentFeed, isLoading, loadTalentFeed, dismissCurrentTalent } = useStageStore();
  const { handleSwipeRight, handleSwipeLeft, handleSwipeUp } = useCasting();
  const [matchToast, setMatchToast] = useState<string | null>(null);

  const currentArtist = activeTalentFeed[0];
  const nextArtist = activeTalentFeed[1];

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
        handleSwipeLeft(artist);
      } else {
        await handleSwipeUp(artist);
        setMatchToast(`${artist.name} guardado en destacados`);
      }
      dismissCurrentTalent(artist.id);
    },
    [dismissCurrentTalent, handleSwipeLeft, handleSwipeRight, handleSwipeUp],
  );

  if (isLoading && activeTalentFeed.length === 0) {
    return <SkeletonLoader variant="card" />;
  }

  if (!currentArtist) {
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
      {nextArtist ? (
        <TalentCard
          key={nextArtist.id}
          artist={nextArtist}
          isTopCard={false}
          onSwipeComplete={() => undefined}
          onTap={() => openProfile(nextArtist)}
        />
      ) : null}

      <TalentCard
        key={currentArtist.id}
        artist={currentArtist}
        isTopCard
        onSwipeComplete={(action) => void onSwipeComplete(action, currentArtist)}
        onTap={() => openProfile(currentArtist)}
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
