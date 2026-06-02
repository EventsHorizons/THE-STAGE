/**
 * @file API Service Layer — "The Stage"
 * @description Axios configuration with interceptors and service methods.
 */

import axios from 'axios';
import { ArtistProfile, CastingMatch } from '../types';

const API_BASE_URL = 'https://api.thestage.com/v1'; // Mock URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor for JWT
api.interceptors.request.use(
  (config) => {
    // Mock token retrieval from storage
    const token = 'MOCK_JWT_TOKEN'; 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Sanitization Helper
const sanitizeData = <T>(data: T): T => {
  if (typeof data === 'string') {
    return data.replace(/<[^>]*>?/gm, '') as unknown as T;
  }
  if (Array.isArray(data)) {
    return data.map(sanitizeData) as unknown as T;
  }
  if (typeof data === 'object' && data !== null) {
    const sanitized = {} as any;
    for (const key in data) {
      sanitized[key] = sanitizeData((data as any)[key]);
    }
    return sanitized as T;
  }
  return data;
};

// Response Interceptor for Sanitization
api.interceptors.response.use(
  (response) => {
    response.data = sanitizeData(response.data);
    return response;
  },
  (error) => Promise.reject(error)
);

export const fetchTalentFeed = async (): Promise<ArtistProfile[]> => {
  const response = await api.get('/talent/feed');
  return response.data;
};

export const sendCastingRequest = async (matchData: Partial<CastingMatch>): Promise<CastingMatch> => {
  const response = await api.post('/casting/match', matchData);
  return response.data;
};

export const updateProfile = async (data: Partial<ArtistProfile>): Promise<ArtistProfile> => {
  const response = await api.patch('/profile', data);
  return response.data;
};

export type ConnectionType = 'like' | 'pass' | 'bookmark';

export const recordConnection = async (
  profileId: string,
  type: ConnectionType,
): Promise<{ success: boolean }> => {
  const response = await api.post('/connections', { profileId, type });
  return response.data;
};

export const fetchBookmarks = async (): Promise<readonly string[]> => {
  const response = await api.get('/connections/bookmarks');
  return response.data;
};

export default api;
