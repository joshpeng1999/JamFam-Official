import { create } from 'zustand';

import { seedPosts } from '../data/seed';
import type { Post, PostType } from '../data/types';
import { loadCollection, saveCollection } from '../services/mockPersistence';
import { useProjectsStore } from './useProjectsStore';

const STORAGE_KEY = 'posts';

export interface CreatePostInput {
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
}

interface PostsState {
  posts: Post[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  getPost: (id: string) => Post | undefined;
  getFeedPosts: (excludeAuthorId: string) => Post[];
  getPostsByAuthor: (authorId: string) => Post[];
  getPostsByProject: (projectId: string) => Post[];
  createPost: (input: CreatePostInput) => Post;
}

export const usePostsStore = create<PostsState>((set, get) => ({
  posts: seedPosts,
  hydrated: false,
  hydrate: async () => {
    if (get().hydrated) return;
    const posts = await loadCollection<Post>(STORAGE_KEY, seedPosts);
    set({ posts, hydrated: true });
  },
  getPost: (id) => get().posts.find((p) => p.id === id),
  getFeedPosts: (excludeAuthorId) =>
    [...get().posts]
      .filter((p) => p.authorId !== excludeAuthorId)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
  getPostsByAuthor: (authorId) =>
    [...get().posts]
      .filter((p) => p.authorId === authorId)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
  getPostsByProject: (projectId) =>
    [...get().posts]
      .filter((p) => p.projectId === projectId)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
  createPost: (input) => {
    const post: Post = {
      id: `post_${Date.now()}`,
      waveformSeed: Math.floor(Math.random() * 1000),
      createdAt: new Date().toISOString(),
      ...input,
    };
    const posts = [post, ...get().posts];
    set({ posts });
    saveCollection(STORAGE_KEY, posts);
    useProjectsStore.getState().touchProject(input.projectId);
    return post;
  },
}));
