import { collection, doc, setDoc } from 'firebase/firestore';
import { create } from 'zustand';

import type { Post, PostType } from '../data/types';
import { firestore } from '../services/firebase';
import { subscribeToQuery, type Subscription } from '../services/firestoreSync';
import { uploadLocalFile } from '../services/mediaUpload';
import { useProjectsStore } from './useProjectsStore';

export interface CreatePostInput {
  projectId: string;
  authorId: string;
  type: PostType;
  title: string;
  description: string;
  // Local `file://` URIs from the pickers; uploaded to Storage on create.
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
  subscribe: () => Subscription;
  getPost: (id: string) => Post | undefined;
  getFeedPosts: (excludeAuthorId: string) => Post[];
  getPostsByAuthor: (authorId: string) => Post[];
  getPostsByProject: (projectId: string) => Post[];
  createPost: (input: CreatePostInput, onUploadProgress?: (fraction: number) => void) => Promise<Post>;
}

const postsCollection = () => collection(firestore(), 'posts');
const newestFirst = (a: Post, b: Post) => (a.createdAt < b.createdAt ? 1 : -1);

export const usePostsStore = create<PostsState>((set, get) => ({
  posts: [],
  subscribe: () => subscribeToQuery<Post>(postsCollection(), (posts) => set({ posts }), 'posts'),
  getPost: (id) => get().posts.find((p) => p.id === id),
  getFeedPosts: (excludeAuthorId) =>
    get()
      .posts.filter((p) => p.authorId !== excludeAuthorId)
      .sort(newestFirst),
  getPostsByAuthor: (authorId) =>
    get()
      .posts.filter((p) => p.authorId === authorId)
      .sort(newestFirst),
  getPostsByProject: (projectId) =>
    get()
      .posts.filter((p) => p.projectId === projectId)
      .sort(newestFirst),
  createPost: async (input, onUploadProgress) => {
    const ref = doc(postsCollection());
    const storageDir = `users/${input.authorId}/posts/${ref.id}`;

    // Upload media first so the post never appears in anyone's feed pointing
    // at a file that isn't there yet.
    const mediaUri = input.mediaUri
      ? await uploadLocalFile(input.mediaUri, `${storageDir}/media`, onUploadProgress)
      : undefined;
    const coverUri = input.coverUri ? await uploadLocalFile(input.coverUri, `${storageDir}/cover`) : undefined;

    const post: Post = {
      ...input,
      id: ref.id,
      mediaUri,
      coverUri,
      waveformSeed: Math.floor(Math.random() * 1000),
      createdAt: new Date().toISOString(),
    };
    const { id: _id, ...data } = post;
    await setDoc(ref, data);
    await useProjectsStore.getState().touchProject(input.projectId);
    return post;
  },
}));
