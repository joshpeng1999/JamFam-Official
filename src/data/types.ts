export type PostType = 'video' | 'audio' | 'lyrics';

export type ProjectStatus = 'in_progress' | 'completed';

export type ConnectionStatus = 'pending' | 'accepted' | 'declined';

export interface Prompt {
  question: string;
  answer: string;
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface User {
  id: string;
  name: string;
  pronouns?: string;
  age?: number;
  location: string;
  tagline: string;
  bio: string;
  roles: string[];
  avatarColor: string;
  socialLinks: SocialLink[];
  portfolioUrl?: string;
  musicalInfluences: string[];
  preferredGenres: string[];
  prompts: Prompt[];
}

export interface Project {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  status: ProjectStatus;
  collaboratorIds: string[];
  updatedAt: string;
}

export interface Post {
  id: string;
  projectId: string;
  authorId: string;
  type: PostType;
  title: string;
  description: string;
  mediaUri?: string;
  coverUri?: string;
  lyricsBody?: string;
  durationSec?: number;
  trimStartSec?: number;
  trimEndSec?: number;
  lookingForTags: string[];
  waveformSeed: number;
  createdAt: string;
}

export interface ConnectionRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  postId: string;
  message?: string;
  status: ConnectionStatus;
  createdAt: string;
}

export interface Conversation {
  // Deterministic: the two participant ids sorted and joined with `_`, so
  // both sides always resolve to the same doc.
  id: string;
  participantIds: string[];
  // The accepted request that connected the pair; security rules check it.
  requestId?: string;
  lastMessage: string;
  lastMessageAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export const COLLABORATOR_ROLES = [
  'Feedback',
  'Guitarist',
  'Bassist',
  'Drummer',
  'Vocalist',
  'Rapper',
  'Keyboardist',
  'DJ',
  'Producer',
  'Lyricist',
  'Graphic Designer',
  'Art Director',
  'Percussionist',
  'Mixing Engineer',
  'Drum Programmer',
  'Composer',
  'Manager',
  'Mastering Engineer',
  'Music Director',
  'Session Musician',
  'Video Editor',
  'Sound Engineer',
  'Visual Effects Artist',
  'Banjo Player',
  'Pro Tools Specialist',
  'Event Planner',
] as const;

export const MAX_CLIP_DURATION_SEC = 60;

// Keep in sync with the `messages` rule in firestore.rules.
export const MAX_MESSAGE_LENGTH = 2000;
