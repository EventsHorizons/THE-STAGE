/**
 * @file Core Type Definitions — "The Stage"
 * @description Strict TypeScript interfaces for business logic and data models.
 */

export interface MediaAsset {
  readonly url: string;
  readonly uri?: string;
  readonly type: 'video' | 'audio' | 'image';
}

export interface ArtistProfile {
  readonly id: string;
  readonly name: string;
  readonly category: 'musician' | 'actor' | 'artist';
  readonly bio: string;
  readonly technicalStats: Record<string, unknown>;
  readonly mediaAssets: MediaAsset[];
  readonly availability: boolean;
  readonly avatarUrl?: string;
  readonly location?: {
    readonly city: string;
    readonly country: string;
  };
  readonly isVerified?: boolean;
  readonly displayCategory?: string;
  readonly uuid?: string;
  readonly biometricData?: {
    readonly heightCm?: number;
  };
  readonly stats?: {
    readonly heightCm?: number;
    readonly instrument?: string;
    readonly experienceYears?: number;
  };
  readonly media?: {
    readonly videoUrl?: string;
    readonly audioUrl?: string;
  };
  readonly portfolio?: readonly MediaAsset[];
}

export interface Project {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly requirements: Array<unknown>;
  readonly budget: number;
  readonly agencyId: string;
}

export interface CastingMatch {
  readonly id: string;
  readonly artistId: string;
  readonly projectId: string;
  readonly status: 'pending' | 'accepted' | 'rejected';
  readonly timestamp: Date;
}

export type UserRole = 'artist' | 'agency' | 'admin';

export interface AuthStatus {
  readonly isAuthenticated: boolean;
  readonly token: string | null;
  readonly userRole: UserRole | null;
  readonly userId: string | null;
}

export type Artist = ArtistProfile;
export type ArtistUser = ArtistProfile;
export interface ScoutUser {
  readonly id: string;
  readonly name: string;
  readonly role: 'scout';
}
