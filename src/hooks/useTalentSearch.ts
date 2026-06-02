/**
 * @file useTalentSearch Hook — "The Stage"
 * @description Search and filtering logic for the talent pool.
 */

import { useMemo } from 'react';
import { useStageStore } from '../store/useStageStore';
import { ArtistProfile } from '../types';

interface SearchFilters {
  query: string;
  category: 'musician' | 'actor' | 'artist' | 'all';
  onlyAvailable: boolean;
}

export const useTalentSearch = (filters: SearchFilters) => {
  const { activeTalentFeed } = useStageStore();

  const filteredTalent = useMemo(() => {
    return activeTalentFeed.filter((artist: ArtistProfile) => {
      const matchesQuery = artist.name.toLowerCase().includes(filters.query.toLowerCase()) ||
                          artist.bio.toLowerCase().includes(filters.query.toLowerCase());
      
      const matchesCategory = filters.category === 'all' || artist.category === filters.category;
      
      const matchesAvailability = !filters.onlyAvailable || artist.availability;

      return matchesQuery && matchesCategory && matchesAvailability;
    });
  }, [activeTalentFeed, filters]);

  return {
    filteredTalent,
    totalCount: filteredTalent.length,
  };
};
