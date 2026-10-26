import { collection, doc, setDoc } from 'firebase/firestore';
import { create } from 'zustand';

import type { User } from '../data/types';
import { firestore } from '../services/firebase';
import { subscribeToQuery, type Subscription } from '../services/firestoreSync';

export type ProfileInput = Omit<User, 'id'>;

interface UsersState {
  users: User[];
  subscribe: () => Subscription;
  getUser: (id: string) => User | undefined;
  // Creates or replaces the signed-in user's own `users/{uid}` doc.
  saveProfile: (uid: string, profile: ProfileInput) => Promise<void>;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  subscribe: () =>
    subscribeToQuery<User>(collection(firestore(), 'users'), (users) => set({ users }), 'users'),
  getUser: (id) => get().users.find((u) => u.id === id),
  saveProfile: async (uid, profile) => {
    await setDoc(doc(firestore(), 'users', uid), profile);
  },
}));
