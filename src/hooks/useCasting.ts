/**
 * @file useCasting — swipe → backend Connection / Match
 */

import { useCallback } from 'react';
import type { ArtistProfile, ConnectionAction } from '../types';
import { useStageStore, selectApplySwipe } from '../store/useStageStore';

export const useCasting = () => {
  const applySwipe = useStageStore(selectApplySwipe);
  const recentMatch = useStageStore((s) => s.recentMatch);
  const currentCastingMatches = useStageStore((s) => s.currentCastingMatches);
  const createMatch = useStageStore((s) => s.createMatch);
  const clearRecentMatch = useStageStore((s) => s.clearRecentMatch);

  const runSwipe = useCallback(
    async (artist: ArtistProfile, action: ConnectionAction) => {
      const receiverUserId = artist.uuid ?? artist.id;
      const match = await applySwipe(receiverUserId, action);
      if (action === 'like' && !match) {
        await createMatch(artist.id, 'active_project');
      }
      return match;
    },
    [applySwipe, createMatch],
  );

  const handleSwipeRight = useCallback(
    (artist: ArtistProfile) => runSwipe(artist, 'like'),
    [runSwipe],
  );

  const handleSwipeLeft = useCallback(
    (artist: ArtistProfile) => runSwipe(artist, 'pass'),
    [runSwipe],
  );

  const handleSwipeUp = useCallback(
    (artist: ArtistProfile) => runSwipe(artist, 'bookmark'),
    [runSwipe],
  );

  const getMatchStatus = useCallback(
    (artistId: string) => {
      const m = currentCastingMatches.find((x) => x.artistId === artistId);
      return m?.status ?? null;
    },
    [currentCastingMatches],
  );

  return {
    handleSwipeRight,
    handleSwipeLeft,
    handleSwipeUp,
    getMatchStatus,
    matches: currentCastingMatches,
    recentMatch,
    clearRecentMatch,
  };
};
