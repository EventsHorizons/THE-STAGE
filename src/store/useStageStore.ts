/**
 * @file Global State — The Stage
 * @description Zustand store: auth, discover feed, swipe actions. Use selectors to limit re-renders.
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type {
  ArtistProfile,
  AuthStatus,
  AuthTokens,
  CastingMatch,
  ConnectionAction,
  Match,
  UserRole,
} from '../types';
import { feedCardToArtistProfile } from '../types/mappers';
import {
  configureApiAuth,
  fetchDiscoverFeed,
  fetchTalentFeed,
  postDiscoverSwipe,
  sendCastingRequest,
} from '../services/api';
import { MOCK_TALENTS } from '../services/mockData';

interface StageState {
  userRole: UserRole | null;
  authStatus: AuthStatus;
  activeTalentFeed: ArtistProfile[];
  feedCursor: number;
  currentCastingMatches: CastingMatch[];
  recentMatch: Match | null;
  isLoading: boolean;
  error: string | null;

  setRole: (role: UserRole) => void;
  setAuth: (status: AuthStatus) => void;
  setTokens: (tokens: AuthTokens) => void;
  loadTalentFeed: () => Promise<void>;
  applySwipe: (receiverId: string, action: ConnectionAction) => Promise<Match | null>;
  dismissCurrentTalent: (artistId: string) => void;
  addCastingMatch: (match: CastingMatch) => void;
  createMatch: (artistId: string, projectId: string) => Promise<void>;
  clearRecentMatch: () => void;
}

const initialAuth: AuthStatus = {
  isAuthenticated: false,
  token: null,
  refreshToken: null,
  userRole: null,
  userId: null,
};

export const useStageStore = create<StageState>()(
  subscribeWithSelector((set, get) => {
    configureApiAuth({
      getAccessToken: () => get().authStatus.token,
      getRefreshToken: () => get().authStatus.refreshToken,
      onTokensRefreshed: (tokens) => {
        set((state) => ({
          authStatus: {
            ...state.authStatus,
            token: tokens.access,
            refreshToken: tokens.refresh,
            isAuthenticated: true,
          },
        }));
      },
    });

    return {
      userRole: 'scout',
      authStatus: initialAuth,
      activeTalentFeed: [...MOCK_TALENTS],
      feedCursor: 0,
      currentCastingMatches: [],
      recentMatch: null,
      isLoading: false,
      error: null,

      setRole: (role) => set({ userRole: role }),

      setAuth: (status) => set({ authStatus: status }),

      setTokens: (tokens) =>
        set((state) => ({
          authStatus: {
            ...state.authStatus,
            isAuthenticated: true,
            token: tokens.access,
            refreshToken: tokens.refresh,
          },
        })),

      loadTalentFeed: async () => {
        set({ isLoading: true, error: null });
        try {
          const cards = await fetchDiscoverFeed();
          const feed = cards.map(feedCardToArtistProfile);
          set({ activeTalentFeed: [...feed], feedCursor: 0, isLoading: false });
        } catch {
          try {
            const feed = await fetchTalentFeed();
            set({ activeTalentFeed: [...feed], feedCursor: 0, isLoading: false });
          } catch {
            set({
              activeTalentFeed: [...MOCK_TALENTS],
              feedCursor: 0,
              isLoading: false,
              error: 'No se pudo cargar el feed',
            });
          }
        }
      },

      applySwipe: async (receiverId, action) => {
        const feed = get().activeTalentFeed;
        const nextFeed = feed.filter((t) => t.id !== receiverId);

        set({
          activeTalentFeed: nextFeed,
          feedCursor: Math.min(get().feedCursor, Math.max(0, nextFeed.length - 1)),
        });

        try {
          const result = await postDiscoverSwipe(receiverId, action);
          if (result.match) {
            set({ recentMatch: result.match });
          }
          return result.match;
        } catch (err) {
          console.warn('Swipe API failed (optimistic UI applied):', err);
          return null;
        }
      },

      dismissCurrentTalent: (artistId) => {
        const next = get().activeTalentFeed.filter((t) => t.id !== artistId);
        set({
          activeTalentFeed: next,
          feedCursor: Math.min(get().feedCursor, Math.max(0, next.length - 1)),
        });
      },

      addCastingMatch: (match) =>
        set((state) => ({
          currentCastingMatches: [...state.currentCastingMatches, match],
        })),

      createMatch: async (artistId, projectId) => {
        const draft: Partial<CastingMatch> = {
          artistId,
          projectId,
          status: 'pending',
          timestamp: new Date().toISOString(),
        };
        try {
          const confirmed = await sendCastingRequest(draft);
          get().addCastingMatch(confirmed);
        } catch {
          get().addCastingMatch({
            id: `match_${Date.now()}`,
            artistId,
            projectId,
            status: 'pending',
            timestamp: new Date().toISOString(),
          });
        }
      },

      clearRecentMatch: () => set({ recentMatch: null }),
    };
  }),
);

/** Shallow selectors — import in screens to avoid full-store subscriptions. */
export const selectDiscoverFeed = (s: StageState) => s.activeTalentFeed;
export const selectFeedHead = (s: StageState) => s.activeTalentFeed[0];
export const selectFeedNext = (s: StageState) => s.activeTalentFeed[1];
export const selectFeedLoading = (s: StageState) => s.isLoading;
export const selectApplySwipe = (s: StageState) => s.applySwipe;
export const selectLoadFeed = (s: StageState) => s.loadTalentFeed;
export const selectRecentMatch = (s: StageState) => s.recentMatch;
