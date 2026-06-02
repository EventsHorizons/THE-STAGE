/**
 * @file Domain Models — The Stage
 * @description Strict TypeScript interfaces for talent discovery, groups, messaging and profile media.
 */

export type MediaItemOrderIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface User {
  readonly id: string;
  readonly email: string;
  readonly phone?: string;
  readonly role: 'artist' | 'scout' | 'admin';
  readonly createdAt: Date;
}

export interface Profile {
  readonly id: string;
  readonly userId: string;
  readonly name: string;
  readonly age: number;
  readonly location: {
    readonly latitude: number;
    readonly longitude: number;
    readonly city: string;
  };
  readonly category: string;
  readonly miniBio: string;
  readonly extendedBio?: string;
  readonly skills: readonly string[];
  readonly experience: readonly string[];
  readonly goals: readonly string[];
  readonly availability: 'immediate' | 'part-time' | 'not-available';
  readonly isValidated: boolean;
}

export interface MediaItem {
  readonly id: string;
  readonly profileId: string;
  readonly type: 'video' | 'image';
  readonly url: string;
  readonly orderIndex: MediaItemOrderIndex;
}

export interface Connection {
  readonly id: string;
  readonly senderId: string;
  readonly receiverId: string;
  readonly type: 'like' | 'pass' | 'bookmark';
  readonly createdAt: Date;
}

export interface Match {
  readonly id: string;
  readonly userOneId: string;
  readonly userTwoId: string;
  readonly createdAt: Date;
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
  readonly role: 'leader' | 'collaborator';
}

export interface Conversation {
  readonly id: string;
  readonly type: 'individual' | 'group';
  readonly associatedGroupId?: string;
  readonly lastMessageAt: Date;
}

export interface Message {
  readonly id: string;
  readonly conversationId: string;
  readonly senderId: string;
  readonly text?: string;
  readonly mediaUrl?: string;
  readonly sharedProfileId?: string;
  readonly createdAt: Date;
}
