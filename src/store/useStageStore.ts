/**
 * @file Global State Management — "The Stage"
 * @description Zustand store for user roles, talent feed, castings, and chat channels.
 */

import { create } from 'zustand';
import { ArtistProfile, CastingMatch, UserRole, AuthStatus } from '../types';
import { fetchTalentFeed, sendCastingRequest } from '../services/api';
import { MOCK_TALENTS } from '../services/mockData';

interface StageState {
  // State
  userRole: UserRole | null;
  authStatus: AuthStatus;
  activeTalentFeed: readonly ArtistProfile[];
  currentCastingMatches: CastingMatch[];
  activeChatChannels: string[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setRole: (role: UserRole) => void;
  loadTalentFeed: () => Promise<void>;
  addCastingMatch: (match: CastingMatch) => void;
  enableChatChannel: (matchId: string) => void;
  createMatch: (artistId: string, projectId: string) => Promise<CastingMatch | null>;
  setAuth: (status: AuthStatus) => void;
}

export const useStageStore = create<StageState>((set, get) => ({
  // Initial State
  userRole: 'agency',
  authStatus: {
    isAuthenticated: true,
    token: 'mock_token',
    userRole: 'agency',
    userId: 'agency_123',
  },
  activeTalentFeed: MOCK_TALENTS,
  currentCastingMatches: [],
  activeChatChannels: [],
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
      set({ activeTalentFeed: MOCK_TALENTS, isLoading: false });
      console.warn('API Fetch failed, using mock data fallback.');
    }
  },

  addCastingMatch: (match) => set((state) => ({
    currentCastingMatches: [...state.currentCastingMatches, match],
  })),

  enableChatChannel: (matchId) => set((state) => ({
    activeChatChannels: state.activeChatChannels.includes(matchId)
      ? state.activeChatChannels
      : [...state.activeChatChannels, matchId],
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
      get().enableChatChannel(confirmedMatch.id);
      return confirmedMatch;
    } catch (err) {
      const mockConfirmed: CastingMatch = {
        id: `match_${Math.random().toString(36).substr(2, 9)}`,
        artistId,
        projectId,
        status: 'pending',
        timestamp: new Date(),
      };
      get().addCastingMatch(mockConfirmed);
      get().enableChatChannel(mockConfirmed.id);
      console.log('Match created optimistically:', mockConfirmed);
      return mockConfirmed;
    }
  },

  setAuth: (status) => set({ authStatus: status }),
}));
