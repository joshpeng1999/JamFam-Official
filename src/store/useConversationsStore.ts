import { collection, doc, orderBy, query, where, writeBatch } from 'firebase/firestore';
import { create } from 'zustand';

import type { Conversation, Message } from '../data/types';
import { firestore } from '../services/firebase';
import { subscribeToQuery, type Subscription } from '../services/firestoreSync';

interface ConversationsState {
  conversations: Conversation[];
  subscribe: (uid: string) => Subscription;
  // Live messages for one chat, oldest first. Scoped to the open chat screen
  // rather than mirrored in the store, unlike the app-wide collections.
  subscribeToMessages: (conversationId: string, onData: (messages: Message[]) => void) => Subscription;
  sendMessage: (myId: string, otherUserId: string, text: string) => Promise<void>;
}

export const conversationsCollection = () => collection(firestore(), 'conversations');
const messagesCollection = (conversationId: string) =>
  collection(firestore(), 'conversations', conversationId, 'messages');

export function conversationIdFor(a: string, b: string): string {
  return [a, b].sort().join('_');
}

export function otherParticipant(conversation: Conversation, myId: string): string | undefined {
  return conversation.participantIds.find((id) => id !== myId);
}

export const useConversationsStore = create<ConversationsState>((set) => ({
  conversations: [],
  subscribe: (uid) =>
    subscribeToQuery<Conversation>(
      query(conversationsCollection(), where('participantIds', 'array-contains', uid)),
      (conversations) =>
        set({ conversations: conversations.sort((a, b) => (a.lastMessageAt < b.lastMessageAt ? 1 : -1)) }),
      'conversations',
    ),
  subscribeToMessages: (conversationId, onData) =>
    subscribeToQuery<Message>(query(messagesCollection(conversationId), orderBy('createdAt')), onData, 'messages'),
  sendMessage: async (myId, otherUserId, text) => {
    const conversationId = conversationIdFor(myId, otherUserId);
    const createdAt = new Date().toISOString();
    const batch = writeBatch(firestore());
    batch.set(doc(messagesCollection(conversationId)), { senderId: myId, text, createdAt });
    batch.update(doc(conversationsCollection(), conversationId), { lastMessage: text, lastMessageAt: createdAt });
    await batch.commit();
  },
}));
