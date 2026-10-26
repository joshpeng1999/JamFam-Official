import { collection, doc, query, setDoc, where } from 'firebase/firestore';
import { create } from 'zustand';

import type { Conversation } from '../data/types';
import { firestore } from '../services/firebase';
import { subscribeToQuery, type Subscription } from '../services/firestoreSync';

interface ConversationsState {
  conversations: Conversation[];
  subscribe: (uid: string) => Subscription;
  ensureConversation: (myId: string, otherUserId: string, lastMessage?: string) => Promise<void>;
}

const conversationsCollection = () => collection(firestore(), 'conversations');

export function conversationIdFor(a: string, b: string): string {
  return [a, b].sort().join('_');
}

export function otherParticipant(conversation: Conversation, myId: string): string | undefined {
  return conversation.participantIds.find((id) => id !== myId);
}

export const useConversationsStore = create<ConversationsState>((set, get) => ({
  conversations: [],
  subscribe: (uid) =>
    subscribeToQuery<Conversation>(
      query(conversationsCollection(), where('participantIds', 'array-contains', uid)),
      (conversations) =>
        set({ conversations: conversations.sort((a, b) => (a.lastMessageAt < b.lastMessageAt ? 1 : -1)) }),
      'conversations',
    ),
  ensureConversation: async (myId, otherUserId, lastMessage) => {
    const id = conversationIdFor(myId, otherUserId);
    const existing = get().conversations.find((c) => c.id === id);
    await setDoc(doc(conversationsCollection(), id), {
      participantIds: [myId, otherUserId].sort(),
      lastMessage: lastMessage ?? existing?.lastMessage ?? 'You’re now connected!',
      lastMessageAt: new Date().toISOString(),
    });
  },
}));
