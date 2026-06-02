/**
 * @file Global State Management — "The Stage"
 * @description Zustand store for user roles, talent feed, and casting matches.
 */

import { create } from 'zustand';
import { ArtistProfile, CastingMatch, UserRole, AuthStatus } from '../types';
import { fetchTalentFeed, sendCastingRequest } from '../services/api';
import { MOCK_TALENTS } from '../services/mockData';

interface StageState {
  // State
  userRole: UserRole | null;
  authStatus: AuthStatus;
  activeTalentFeed: ArtistProfile[];
  currentCastingMatches: CastingMatch[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setRole: (role: UserRole) => void;
  loadTalentFeed: () => Promise<void>;
  addCastingMatch: (match: CastingMatch) => void;
  createMatch: (artistId: string, projectId: string) => Promise<void>;
  dismissCurrentTalent: (artistId: string) => void;
  setAuth: (status: AuthStatus) => void;
}

export const useStageStore = create<StageState>((set, get) => ({
  // Initial State
  userRole: 'agency', // Default for scouting
  authStatus: {
    isAuthenticated: true,
    token: 'mock_token',
    userRole: 'agency',
    userId: 'agency_123',
  },
  activeTalentFeed: [...MOCK_TALENTS],
  currentCastingMatches: [],
  isLoading: false,
  error: null,

  // Actions
  setRole: (role) => set({ userRole: role }),
  
  loadTalentFeed: async () => {
    set({ isLoading: true, error: null });
    try {
      const feed = await fetchTalentFeed();
      set({ activeTalentFeed: feed, isLoading: false });
    } catch (err) {
      // Fallback to mock data if API fails in this phase
      set({ activeTalentFeed: [...MOCK_TALENTS], isLoading: false });
      console.warn('API Fetch failed, using mock data fallback.');
    }
  },

  addCastingMatch: (match) => set((state) => ({
    currentCastingMatches: [...state.currentCastingMatches, match],
  })),

  createMatch: async (artistId, projectId) => {
    const newMatch: Partial<CastingMatch> = {
      artistId,
      projectId,
      status: 'pending',
      timestamp: new Date(),
    };
    
    try {
      const confirmedMatch = await sendCastingRequest(newMatch);
      get().addCastingMatch(confirmedMatch);
    } catch (err) {
      // Optimistic mock update
      const mockConfirmed: CastingMatch = {
        id: `match_${Math.random().toString(36).substr(2, 9)}`,
        artistId,
        projectId,
        status: 'pending',
        timestamp: new Date(),
      };
      get().addCastingMatch(mockConfirmed);
      console.log('Match created optimistically:', mockConfirmed);
    }
  },

  dismissCurrentTalent: (artistId) =>
    set((state) => ({
      activeTalentFeed: state.activeTalentFeed.filter((t) => t.id !== artistId),
    })),

  setAuth: (status) => set({ authStatus: status }),
}));
