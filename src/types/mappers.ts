/**
 * @file Domain ↔ UI mappers — The Stage
 */

import type { ArtistProfile, MediaAsset } from './artist-profile';
import type {
  ProfileDetail,
  ProfileFeedCard,
  AvailabilityStatus,
  MediaItem,
} from './models';

const AVAILABILITY_TO_BOOL: Record<AvailabilityStatus, boolean> = {
  immediate: true,
  'part-time': true,
  'not-available': false,
};

function mapMediaItems(items: readonly MediaItem[]): MediaAsset[] {
  return items.map((m) => ({
    url: m.url,
    uri: m.url,
    type: m.type === 'audio' ? 'audio' : m.type,
  }));
}

function categoryToLegacy(
  category: string,
): 'musician' | 'actor' | 'artist' {
  const lower = category.toLowerCase();
  if (lower.includes('music') || lower.includes('músic')) return 'musician';
  if (lower.includes('actor') || lower.includes('act')) return 'actor';
  return 'artist';
}

/** Discover feed card → TalentCard / legacy ArtistProfile. */
export function feedCardToArtistProfile(card: ProfileFeedCard): ArtistProfile {
  return {
    id: card.id,
    name: card.name,
    category: categoryToLegacy(card.category),
    displayCategory: card.displayCategory ?? card.category,
    bio: card.miniBio,
    technicalStats: {
      skills: [...card.skills],
    },
    mediaAssets: card.previewMediaUrl
      ? [
          {
            url: card.previewMediaUrl,
            uri: card.previewMediaUrl,
            type: card.previewMediaType ?? 'image',
          },
        ]
      : [],
    availability: AVAILABILITY_TO_BOOL[card.availability],
    avatarUrl: card.avatarUrl,
    location: card.location
      ? { city: card.location.city, country: card.location.country ?? '' }
      : undefined,
    isVerified: card.isValidated,
    uuid: card.userId,
    portfolio: card.previewMediaUrl
      ? [{ url: card.previewMediaUrl, type: card.previewMediaType ?? 'image' }]
      : [],
  };
}

/** Full profile → Bento screen model. */
export function profileDetailToArtistProfile(detail: ProfileDetail): ArtistProfile {
  const media = mapMediaItems(detail.mediaItems);
  const firstVideo = detail.mediaItems.find((m) => m.type === 'video');
  const firstAudio = detail.audioTracks[0];

  return {
    id: detail.id,
    name: detail.name,
    category: categoryToLegacy(detail.category),
    displayCategory: detail.displayCategory ?? detail.category,
    bio: detail.miniBio,
    technicalStats: detail.technicalStats,
    mediaAssets: media,
    availability: AVAILABILITY_TO_BOOL[detail.availability],
    avatarUrl: detail.avatarUrl,
    location: {
      city: detail.location.city,
      country: detail.location.country ?? '',
    },
    isVerified: detail.isValidated,
    uuid: detail.userId,
    stats: {
      experienceYears: Number(detail.technicalStats.experienceYears) || undefined,
      instrument: String(detail.technicalStats.instrument ?? '') || undefined,
      heightCm: Number(detail.technicalStats.heightCm) || undefined,
    },
    media: {
      videoUrl: firstVideo?.url,
      audioUrl: firstAudio?.url,
    },
    portfolio: media,
  };
}

export function mockArtistToFeedCard(artist: ArtistProfile): ProfileFeedCard {
  return {
    id: artist.id,
    userId: artist.uuid ?? artist.id,
    name: artist.name,
    category: artist.displayCategory ?? artist.category,
    displayCategory: artist.displayCategory,
    miniBio: artist.bio,
    skills: Array.isArray(artist.technicalStats.skills)
      ? (artist.technicalStats.skills as string[])
      : [],
    availability: artist.availability ? 'immediate' : 'not-available',
    isValidated: artist.isVerified ?? false,
    avatarUrl: artist.avatarUrl,
    previewMediaUrl: artist.avatarUrl,
    previewMediaType: 'image',
    location: artist.location
      ? {
          latitude: 0,
          longitude: 0,
          city: artist.location.city,
          country: artist.location.country,
        }
      : undefined,
  };
}
