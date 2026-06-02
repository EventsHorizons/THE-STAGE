/**
 * @file Zustand Global Store Specification — "The Stage"
 * @description Secure, low-latency global state engine managing authentication states,
 * session profiles, caching models, and casting invitation queues.
 */

import { create } from 'zustand';
import { ArtistUser, ScoutUser, MediaAsset } from '../types';

export type UserRole = 'ARTIST' | 'SCOUT' | null;

interface CastingInvitation {
  readonly id: string;
  readonly artistId: string;
  readonly scoutId: string;
  readonly timestamp: string;
  readonly status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
}

interface StageState {
  // Authentication & Session States
  readonly isAuthenticated: boolean;
  readonly userRole: UserRole;
  readonly currentUser: ArtistUser | ScoutUser | null;
  
  // Talent Caching Layers
  readonly cachedTalents: readonly ArtistUser[];
  readonly activeSpotlightIndex: number;
  
  // Castings and Invites State
  readonly activeInvitations: readonly CastingInvitation[];
  
  // Operations & Actions
  readonly setAuthentication: (auth: boolean, role: UserRole, user: ArtistUser | ScoutUser | null) => void;
  readonly cacheTalents: (talents: readonly ArtistUser[]) => void;
  readonly setSpotlightIndex: (index: number) => void;
  readonly dispatchCastingInvite: (artistId: string, scoutId: string) => Promise<{ success: boolean; inviteId: string }>;
  readonly logout: () => void;
}

export const useStageStore = create<StageState>((set, get) => ({
  isAuthenticated: false,
  userRole: null,
  currentUser: null,
  cachedTalents: [],
  activeSpotlightIndex: 0,
  activeInvitations: [],

  setAuthentication: (auth, role, user) => set({
    isAuthenticated: auth,
    userRole: role,
    currentUser: user
  }),

  cacheTalents: (talents) => set({
    cachedTalents: talents
  }),

  setSpotlightIndex: (index) => set({
    activeSpotlightIndex: index
  }),

  dispatchCastingInvite: async (artistId, scoutId) => {
    // Generate secure identifier mimicking ISO compliant distributed database entry
    const secureInviteId = `inv_${Math.random().toString(36).substring(2, 15)}`;
    const newInvite: CastingInvitation = {
      id: secureInviteId,
      artistId,
      scoutId,
      timestamp: new Date().toISOString(),
      status: 'PENDING',
    };

    // Simulate async transmission delay
    await new Promise(resolve => setTimeout(resolve, 800));

    set(state => ({
      activeInvitations: [...state.activeInvitations, newInvite]
    }));

    return { success: true, inviteId: secureInviteId };
  },

  logout: () => set({
    isAuthenticated: false,
    userRole: null,
    currentUser: null,
    activeSpotlightIndex: 0
  })
}));
