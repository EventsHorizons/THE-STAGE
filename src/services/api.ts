/**
 * @file API Service Layer — The Stage
 * @description Axios client wired to Django REST (/api/v1). Token from Zustand auth slice.
 */

import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type {
  ArtistProfile,
  AuthTokens,
  CastingMatch,
  ConnectionAction,
  DiscoverFeedFilters,
  ProfileDetail,
  ProfileFeedCard,
  SwipeResponse,
  UserRole,
} from '../types';
import { feedCardToArtistProfile, mockArtistToFeedCard } from '../types/mappers';
import { MOCK_TALENTS } from './mockData';
import { normalizeKeys } from './normalize';

const API_BASE_URL =
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL) ||
  'http://127.0.0.1:8000/api/v1';

let authTokenGetter: (() => string | null) | null = null;
let refreshTokenGetter: (() => string | null) | null = null;
let onTokensRefreshed: ((tokens: AuthTokens) => void) | null = null;

export function configureApiAuth(config: {
  getAccessToken: () => string | null;
  getRefreshToken?: () => string | null;
  onTokensRefreshed?: (tokens: AuthTokens) => void;
}): void {
  authTokenGetter = config.getAccessToken;
  refreshTokenGetter = config.getRefreshToken ?? null;
  onTokensRefreshed = config.onTokensRefreshed ?? null;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

const sanitizeData = <T>(data: T): T => {
  if (typeof data === 'string') {
    return data.replace(/<[^>]*>?/gm, '') as unknown as T;
  }
  if (Array.isArray(data)) {
    return data.map(sanitizeData) as unknown as T;
  }
  if (typeof data === 'object' && data !== null) {
    const sanitized: Record<string, unknown> = {};
    for (const key of Object.keys(data as object)) {
      sanitized[key] = sanitizeData((data as Record<string, unknown>)[key]);
    }
    return sanitized as T;
  }
  return data;
};

api.interceptors.request.use((config) => {
  const token = authTokenGetter?.() ?? null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

const flushQueue = (token: string | null) => {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
};

api.interceptors.response.use(
  (response) => {
    response.data = sanitizeData(response.data);
    return response;
  },
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status !== 401 || !original || original._retry) {
      return Promise.reject(error);
    }

    const refresh = refreshTokenGetter?.();
    if (!refresh) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push((token) => {
          if (!token) {
            reject(error);
            return;
          }
          original.headers.Authorization = `Bearer ${token}`;
          resolve(api(original));
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post<AuthTokens>(`${API_BASE_URL}/auth/token/refresh/`, {
        refresh,
      });
      onTokensRefreshed?.(data);
      flushQueue(data.access);
      original.headers.Authorization = `Bearer ${data.access}`;
      return api(original);
    } catch (refreshError) {
      flushQueue(null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface RegisterPayload {
  readonly email: string;
  readonly password: string;
  readonly role: UserRole;
  readonly phone?: string;
}

export const login = async (email: string, password: string): Promise<AuthTokens> => {
  const { data } = await api.post<AuthTokens>('/auth/token/', { email, password });
  return data;
};

export const register = async (payload: RegisterPayload): Promise<{ id: string; email: string }> => {
  const { data } = await api.post('/auth/register/', payload);
  return data;
};

export const verifyOtp = async (email: string, code: string): Promise<{ verified: boolean }> => {
  const { data } = await api.post('/auth/otp/verify/', { email, code });
  return data;
};

// ─── Discover ────────────────────────────────────────────────────────────────

export const fetchDiscoverFeed = async (
  filters?: DiscoverFeedFilters,
): Promise<readonly ProfileFeedCard[]> => {
  try {
    const { data } = await api.get<unknown>('/discover/feed/', { params: filters });
    const list = Array.isArray(data) ? data : (data as { results?: unknown[] }).results ?? [];
    return normalizeKeys<ProfileFeedCard[]>(list);
  } catch {
    return MOCK_TALENTS.map(mockArtistToFeedCard);
  }
};

export const fetchTalentFeed = async (): Promise<ArtistProfile[]> => {
  const cards = await fetchDiscoverFeed();
  return cards.map(feedCardToArtistProfile);
};

export const postDiscoverSwipe = async (
  receiverId: string,
  actionType: ConnectionAction,
): Promise<SwipeResponse> => {
  const numericReceiver = Number(receiverId);
  const { data } = await api.post<unknown>('/discover/swipe/', {
    receiver_id: Number.isFinite(numericReceiver) ? numericReceiver : receiverId,
    action_type: actionType,
  });
  return normalizeKeys<SwipeResponse>(data);
};

export type ConnectionType = ConnectionAction;

export const recordConnection = async (
  profileId: string,
  type: ConnectionType,
): Promise<SwipeResponse> => postDiscoverSwipe(profileId, type);

// ─── Profiles ────────────────────────────────────────────────────────────────

export const fetchProfileDetail = async (profileId: string): Promise<ProfileDetail> => {
  const { data } = await api.get<unknown>(`/profiles/${profileId}/`);
  return normalizeKeys<ProfileDetail>(data);
};

export const updateProfile = async (
  data: Partial<ProfileDetail>,
): Promise<ProfileDetail> => {
  const { data: updated } = await api.patch<ProfileDetail>('/profiles/me/', data);
  return updated;
};

// ─── Legacy casting ──────────────────────────────────────────────────────────

export const sendCastingRequest = async (
  matchData: Partial<CastingMatch>,
): Promise<CastingMatch> => {
  const { data } = await api.post<CastingMatch>('/casting/match/', matchData);
  return data;
};

export const fetchBookmarks = async (): Promise<readonly string[]> => {
  const { data } = await api.get<string[]>('/connections/bookmarks/');
  return data;
};

export default api;
