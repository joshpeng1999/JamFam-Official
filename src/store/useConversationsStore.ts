import { create } from 'zustand';

import { seedConversations } from '../data/seed';
import type { Conversation } from '../data/types';
import { loadCollection, saveCollection } from '../services/mockPersistence';

const STORAGE_KEY = 'conversations';

interface ConversationsState {
  conversations: Conversation[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  ensureConversation: (userId: string, lastMessage?: string) => void;
}

export const useConversationsStore = create<ConversationsState>((set, get) => ({
  conversations: seedConversations,
  hydrated: false,
  hydrate: async () => {
    if (get().hydrated) return;
    const conversations = await loadCollection<Conversation>(STORAGE_KEY, seedConversations);
    set({ conversations, hydrated: true });
  },
  ensureConversation: (userId, lastMessage) => {
    const existing = get().conversations.find((c) => c.userId === userId);
    const conversations = existing
      ? get().conversations.map((c) =>
          c.userId === userId
            ? { ...c, lastMessage: lastMessage ?? c.lastMessage, lastMessageAt: new Date().toISOString() }
            : c,
        )
      : [
          {
            id: `conv_${Date.now()}`,
            userId,
            lastMessage: lastMessage ?? 'You’re now connected!',
            lastMessageAt: new Date().toISOString(),
          },
          ...get().conversations,
        ];
    set({ conversations });
    saveCollection(STORAGE_KEY, conversations);
  },
}));
