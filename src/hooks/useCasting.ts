/**
 * @file useCasting Hook — "The Stage"
 * @description Logic for handling swipes and casting match lifecycle.
 */

import { useCallback } from 'react';
import { useStageStore } from '../store/useStageStore';
import { ArtistProfile } from '../types';

export const useCasting = () => {
  const { createMatch, currentCastingMatches } = useStageStore();

  const handleSwipeRight = useCallback(async (artist: ArtistProfile) => {
    console.log(`Scouting Engine: Swipe right detected for ${artist.name}`);
    // Create match instance in pending state
    await createMatch(artist.id, 'current_active_project_id');
  }, [createMatch]);

  const handleSwipeLeft = useCallback((artist: ArtistProfile) => {
    console.log(`Scouting Engine: Swipe left detected for ${artist.name} (ignored)`);
  }, []);

  const handleSwipeUp = useCallback(async (artist: ArtistProfile) => {
    console.log(`Scouting Engine: Bookmark for ${artist.name}`);
    // v2: persist via recordConnection('bookmark')
  }, []);

  const getMatchStatus = useCallback((artistId: string) => {
    const match = currentCastingMatches.find(m => m.artistId === artistId);
    return match ? match.status : null;
  }, [currentCastingMatches]);

  return {
    handleSwipeRight,
    handleSwipeLeft,
    handleSwipeUp,
    getMatchStatus,
    matches: currentCastingMatches,
  };
};
