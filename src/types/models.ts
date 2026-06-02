/**
 * @file Domain Models — The Stage (source of truth)
 * @description Strict domain entities aligned with Django ORM. UI adapters live in mappers.ts.
 */

// ─── Enums (mirror backend TextChoices) ─────────────────────────────────────

export type UserRole = 'artist' | 'scout' | 'admin';

export type ConnectionAction = 'like' | 'pass' | 'bookmark';

export type AvailabilityStatus = 'immediate' | 'part-time' | 'not-available';

export type MediaType = 'video' | 'image' | 'audio';

export type GroupMemberRole = 'leader' | 'collaborator';

export type ConversationType = 'individual' | 'group';

export type CastingStatus = 'pending' | 'accepted' | 'rejected';

/** Backend allows order_index 0–6 (max 7 media items). */
export type MediaItemOrderIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const MAX_MEDIA_PER_PROFILE = 7 as const;

// ─── Core entities ───────────────────────────────────────────────────────────

export interface User {
  readonly id: string;
  readonly email: string;
  readonly phone?: string;
  readonly role: UserRole;
  readonly createdAt: string;
}

export interface GeoLocation {
  readonly latitude: number;
  readonly longitude: number;
  readonly city: string;
  readonly country?: string;
}

export interface Profile {
  readonly id: string;
  readonly userId: string;
  readonly name: string;
  readonly age: number;
  readonly location: GeoLocation;
  readonly category: string;
  readonly displayCategory?: string;
  readonly miniBio: string;
  readonly extendedBio?: string;
  readonly skills: readonly string[];
  readonly experience: readonly string[];
  readonly goals: readonly string[];
  readonly availability: AvailabilityStatus;
  readonly isValidated: boolean;
  readonly avatarUrl?: string;
  readonly overallRating?: number;
  readonly reviewCount?: number;
}

export interface MediaItem {
  readonly id: string;
  readonly profileId: string;
  readonly type: MediaType;
  readonly url: string;
  readonly orderIndex: MediaItemOrderIndex;
  readonly durationSeconds?: number;
}

export interface AudioTrack {
  readonly id: string;
  readonly profileId: string;
  readonly title: string;
  readonly url: string;
  readonly durationSeconds?: number;
  readonly orderIndex: number;
}

export interface Connection {
  readonly id: string;
  readonly senderId: string;
  readonly receiverId: string;
  readonly type: ConnectionAction;
  readonly createdAt: string;
}

export interface Match {
  readonly id: string;
  readonly userOneId: string;
  readonly userTwoId: string;
  readonly createdAt: string;
}

export interface Group {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly createdBy: string;
  readonly avatarUrl?: string;
  readonly projectsActive: boolean;
}

export interface GroupMember {
  readonly id: string;
  readonly groupId: string;
  readonly userId: string;
  readonly role: GroupMemberRole;
}

export interface Conversation {
  readonly id: string;
  readonly type: ConversationType;
  readonly associatedGroupId?: string;
  readonly lastMessageAt: string;
}

export interface Message {
  readonly id: string;
  readonly conversationId: string;
  readonly senderId: string;
  readonly text?: string;
  readonly mediaUrl?: string;
  readonly sharedProfileId?: string;
  readonly createdAt: string;
}

export interface Project {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly requirements: readonly string[];
  readonly budget: number;
  readonly agencyId: string;
}

export interface CastingMatch {
  readonly id: string;
  readonly artistId: string;
  readonly projectId: string;
  readonly status: CastingStatus;
  readonly timestamp: string;
}

// ─── API payloads (discover / swipe) ─────────────────────────────────────────

export interface DiscoverFeedFilters {
  readonly category?: string;
  readonly city?: string;
  readonly availability?: AvailabilityStatus;
  readonly latitude?: number;
  readonly longitude?: number;
  readonly radiusKm?: number;
}

export interface SwipeRequest {
  readonly receiverId: string;
  readonly actionType: ConnectionAction;
}

export interface SwipeResponse {
  readonly connection: Connection;
  readonly match: Match | null;
  readonly isMutual: boolean;
}

export interface AuthTokens {
  readonly access: string;
  readonly refresh: string;
}

export interface AuthStatus {
  readonly isAuthenticated: boolean;
  readonly token: string | null;
  readonly refreshToken: string | null;
  readonly userRole: UserRole | null;
  readonly userId: string | null;
}

/** Card payload from GET /discover/feed/ (optimized for TalentCard). */
export interface ProfileFeedCard {
  readonly id: string;
  readonly userId: string;
  readonly name: string;
  readonly category: string;
  readonly displayCategory?: string;
  readonly miniBio: string;
  readonly skills: readonly string[];
  readonly availability: AvailabilityStatus;
  readonly isValidated: boolean;
  readonly avatarUrl?: string;
  readonly previewMediaUrl?: string;
  readonly previewMediaType?: 'video' | 'image';
  readonly location?: GeoLocation;
}

/** Full Bento payload from GET /profiles/:id/ */
export interface ProfileDetail extends Profile {
  readonly mediaItems: readonly MediaItem[];
  readonly audioTracks: readonly AudioTrack[];
  readonly technicalStats: Readonly<Record<string, string | number | boolean>>;
}
