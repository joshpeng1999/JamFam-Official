import { create } from 'zustand';

import { seedConnectionRequests } from '../data/seed';
import type { ConnectionRequest } from '../data/types';
import { loadCollection, saveCollection } from '../services/mockPersistence';
import { useConversationsStore } from './useConversationsStore';

const STORAGE_KEY = 'connectionRequests';

interface ConnectionsState {
  requests: ConnectionRequest[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  getIncomingRequests: (userId: string) => ConnectionRequest[];
  getAcceptedConnectionIds: (userId: string) => string[];
  sendConnectionRequest: (input: {
    fromUserId: string;
    toUserId: string;
    postId: string;
    message?: string;
  }) => ConnectionRequest;
  respondToRequest: (id: string, status: 'accepted' | 'declined') => void;
}

export const useConnectionsStore = create<ConnectionsState>((set, get) => ({
  requests: seedConnectionRequests,
  hydrated: false,
  hydrate: async () => {
    if (get().hydrated) return;
    const requests = await loadCollection<ConnectionRequest>(STORAGE_KEY, seedConnectionRequests);
    set({ requests, hydrated: true });
  },
  getIncomingRequests: (userId) =>
    [...get().requests]
      .filter((r) => r.toUserId === userId && r.status === 'pending')
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
  getAcceptedConnectionIds: (userId) =>
    get()
      .requests.filter(
        (r) => r.status === 'accepted' && (r.fromUserId === userId || r.toUserId === userId),
      )
      .map((r) => (r.fromUserId === userId ? r.toUserId : r.fromUserId)),
  sendConnectionRequest: ({ fromUserId, toUserId, postId, message }) => {
    const request: ConnectionRequest = {
      id: `req_${Date.now()}`,
      fromUserId,
      toUserId,
      postId,
      message,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const requests = [request, ...get().requests];
    set({ requests });
    saveCollection(STORAGE_KEY, requests);
    return request;
  },
  respondToRequest: (id, status) => {
    const target = get().requests.find((r) => r.id === id);
    const requests = get().requests.map((r) => (r.id === id ? { ...r, status } : r));
    set({ requests });
    saveCollection(STORAGE_KEY, requests);
    if (status === 'accepted' && target) {
      useConversationsStore.getState().ensureConversation(target.fromUserId, target.message);
    }
  },
}));
