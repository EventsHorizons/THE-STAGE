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
    Accept: 'application/json',
  },
});

// Request Interceptor for JWT and security headers
api.interceptors.request.use(
  (config) => {
    const token = 'MOCK_JWT_TOKEN';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    config.headers['Cache-Control'] = 'no-cache';
    return config;
  },
  (error) => Promise.reject(error)
);

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
  const payload = sanitizeData({
    ...matchData,
    timestamp: matchData.timestamp instanceof Date ? matchData.timestamp.toISOString() : new Date().toISOString(),
  });

  const response = await api.post('/casting/match', payload);
  return response.data;
};

export const updateProfile = async (data: Partial<ArtistProfile>): Promise<ArtistProfile> => {
  const payload = sanitizeData(data);
  const response = await api.patch('/profile', payload);
  return response.data;
};

export default api;
