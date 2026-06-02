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
    const match = await createMatch(artist.id, 'current_active_project_id');
    if (match) {
      console.log(`Casting Workflow: chat set up for match ${match.id}`);
    }
    return match;
  }, [createMatch]);

  const handleSwipeLeft = useCallback((artist: ArtistProfile) => {
    console.log(`Scouting Engine: Swipe left detected for ${artist.name} (ignored)`);
  }, []);

  const getMatchStatus = useCallback((artistId: string) => {
    const match = currentCastingMatches.find(m => m.artistId === artistId);
    return match ? match.status : null;
  }, [currentCastingMatches]);

  return {
    handleSwipeRight,
    handleSwipeLeft,
    getMatchStatus,
    matches: currentCastingMatches,
  };
};
