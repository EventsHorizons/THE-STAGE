/**
 * @file ArtistProfile — UI card model for screens
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
  readonly mediaAssets: readonly MediaAsset[];
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

export type Artist = ArtistProfile;
export type ArtistUser = ArtistProfile;
