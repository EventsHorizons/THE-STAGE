/**
 * @file High-Fidelity Mock Database Specification — "The Stage"
 * @description Premium mocked data simulating a Django microservices response payload.
 * Backed by secure hash credentials and complete biometric properties.
 */

import { ArtistUser } from '../types';

export const MOCK_TALENTS: readonly ArtistUser[] = [
  {
    id: '1',
    uuid: 'artist-elena-rostova-001',
    name: 'Elena Rostova',
    category: 'musician',
    displayCategory: 'Classical Guitarist',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800',
    bio: 'Bridging the gap between classical acoustic mastery and modern digital soundscapes. Vienna Conservatory alumni and international performance soloist.',
    availability: true,
    isVerified: true,
    location: {
      city: 'Vienna',
      country: 'Austria',
    },
    biometricData: {
      heightCm: 172,
    },
    stats: {
      heightCm: 172,
      instrument: 'Classical Guitar',
      experienceYears: 8,
    },
    media: {
      videoUrl: '',
      audioUrl: 'https://audio.thestage.premium/tracks/capricho-arabe.mp3',
    },
    portfolio: [
      {
        uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        type: 'image',
      },
      {
        uri: 'https://audio.thestage.premium/tracks/capricho-arabe.mp3',
        url: 'https://audio.thestage.premium/tracks/capricho-arabe.mp3',
        type: 'audio',
      }
    ],
    mediaAssets: [
      {
        url: 'https://audio.thestage.premium/tracks/capricho-arabe.mp3',
        type: 'audio',
      },
      {
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        type: 'image',
      }
    ],
    technicalStats: {
      primaryInstrumentOrGenre: 'Classical Guitarist',
      experienceYears: 8,
      overallRating: 4.9,
      skills: ['Neo-Classical', 'Acoustic Guitar', 'Midi Composers', 'Improvisation'],
      heightCm: 172,
    },
  },
  {
    id: '2',
    uuid: 'artist-marcus-vance-002',
    name: 'Marcus Vance',
    category: 'musician',
    displayCategory: 'Acoustic Percussionist',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    bio: 'Pioneering innovative neo-percussion methods. Rhythmic director for multiple award-winning contemporary dance choreographies across Europe.',
    availability: true,
    isVerified: true,
    location: {
      city: 'London',
      country: 'United Kingdom',
    },
    biometricData: {
      heightCm: 185,
    },
    stats: {
      heightCm: 185,
      instrument: 'Neo-Percussion',
      experienceYears: 10,
    },
    media: {
      videoUrl: '',
      audioUrl: '',
    },
    portfolio: [
      {
        uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
        type: 'image',
      }
    ],
    mediaAssets: [
      {
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
        type: 'image',
      }
    ],
    technicalStats: {
      primaryInstrumentOrGenre: 'Acoustic Percussionist',
      experienceYears: 10,
      overallRating: 5.0,
      skills: ['Polyrythms', 'Live Sets', 'Hand Drums', 'Sound Design'],
      heightCm: 185,
    },
  }
];
