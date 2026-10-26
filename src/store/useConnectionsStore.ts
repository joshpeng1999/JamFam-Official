import { collection, doc, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { create } from 'zustand';

import type { ConnectionRequest } from '../data/types';
import { firestore } from '../services/firebase';
import { subscribeToQuery, type Subscription } from '../services/firestoreSync';
import { useConversationsStore } from './useConversationsStore';

interface ConnectionsState {
  // Merged view of requests the signed-in user sent and received.
  requests: ConnectionRequest[];
  subscribe: (uid: string) => Subscription;
  getIncomingRequests: (userId: string) => ConnectionRequest[];
  getAcceptedConnectionIds: (userId: string) => string[];
  sendConnectionRequest: (input: {
    fromUserId: string;
    toUserId: string;
    postId: string;
    message?: string;
  }) => Promise<ConnectionRequest>;
  respondToRequest: (id: string, status: 'accepted' | 'declined') => Promise<void>;
}

const requestsCollection = () => collection(firestore(), 'connectionRequests');

export const useConnectionsStore = create<ConnectionsState>((set, get) => {
  // Security rules only let a user read requests they're part of, so we
  // listen to the "sent" and "received" halves separately and merge them.
  let sent: ConnectionRequest[] = [];
  let received: ConnectionRequest[] = [];
  const publish = () => set({ requests: [...received, ...sent] });

  return {
    requests: [],
    subscribe: (uid) => {
      sent = [];
      received = [];
      const sentSub = subscribeToQuery<ConnectionRequest>(
        query(requestsCollection(), where('fromUserId', '==', uid)),
        (items) => {
          sent = items;
          publish();
        },
        'sent requests',
      );
      const receivedSub = subscribeToQuery<ConnectionRequest>(
        query(requestsCollection(), where('toUserId', '==', uid)),
        (items) => {
          received = items;
          publish();
        },
        'received requests',
      );
      return {
        unsubscribe: () => {
          sentSub.unsubscribe();
          receivedSub.unsubscribe();
        },
        firstLoad: Promise.all([sentSub.firstLoad, receivedSub.firstLoad]).then(() => {}),
      };
    },
    getIncomingRequests: (userId) =>
      get()
        .requests.filter((r) => r.toUserId === userId && r.status === 'pending')
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    getAcceptedConnectionIds: (userId) =>
      get()
        .requests.filter(
          (r) => r.status === 'accepted' && (r.fromUserId === userId || r.toUserId === userId),
        )
        .map((r) => (r.fromUserId === userId ? r.toUserId : r.fromUserId)),
    sendConnectionRequest: async ({ fromUserId, toUserId, postId, message }) => {
      const ref = doc(requestsCollection());
      const request: ConnectionRequest = {
        id: ref.id,
        fromUserId,
        toUserId,
        postId,
        message,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      const { id: _id, ...data } = request;
      await setDoc(ref, data);
      return request;
    },
    respondToRequest: async (id, status) => {
      const target = get().requests.find((r) => r.id === id);
      await updateDoc(doc(requestsCollection(), id), { status });
      if (status === 'accepted' && target) {
        await useConversationsStore
          .getState()
          .ensureConversation(target.toUserId, target.fromUserId, target.message);
      }
    },
  };
});
