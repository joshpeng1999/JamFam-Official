import { create } from 'zustand';

import type { PostType } from '../data/types';

// In-memory (not persisted) scratch state shared across the multi-step
// create-post flow (`app/create/*`). Reset whenever the flow is entered or
// completed so a half-finished draft never leaks into the next post.
interface CreatePostDraftState {
  type: PostType | null;
  title: string;
  mediaUri: string | null;
  durationSec: number;
  trimStartSec: number;
  trimEndSec: number;
  description: string;
  lyricsBody: string;
  coverUri: string | null;
  tags: string[];
  projectId: string | null;
  newProjectTitle: string;

  setField: <K extends keyof CreatePostDraftState>(key: K, value: CreatePostDraftState[K]) => void;
  reset: () => void;
}

const initialState = {
  type: null as PostType | null,
  title: '',
  mediaUri: null as string | null,
  durationSec: 0,
  trimStartSec: 0,
  trimEndSec: 0,
  description: '',
  lyricsBody: '',
  coverUri: null as string | null,
  tags: [] as string[],
  projectId: null as string | null,
  newProjectTitle: '',
};

export const useCreatePostDraftStore = create<CreatePostDraftState>((set) => ({
  ...initialState,
  setField: (key, value) => set({ [key]: value } as Partial<CreatePostDraftState>),
  reset: () => set({ ...initialState }),
}));
