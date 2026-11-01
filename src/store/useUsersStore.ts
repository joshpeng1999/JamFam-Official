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
  // Case-insensitive name matches, names starting with the text first.
  searchUsers: (text: string, excludeUserId: string) => User[];
  // Creates or replaces the signed-in user's own `users/{uid}` doc.
  saveProfile: (uid: string, profile: ProfileInput) => Promise<void>;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  subscribe: () =>
    subscribeToQuery<User>(collection(firestore(), 'users'), (users) => set({ users }), 'users'),
  getUser: (id) => get().users.find((u) => u.id === id),
  searchUsers: (text, excludeUserId) => {
    const needle = text.trim().toLowerCase();
    if (!needle) return [];
    const startsWithNeedle = (user: User) => user.name.toLowerCase().startsWith(needle);
    return get()
      .users.filter((u) => u.id !== excludeUserId && u.name.toLowerCase().includes(needle))
      .sort(
        (a, b) =>
          Number(startsWithNeedle(b)) - Number(startsWithNeedle(a)) || a.name.localeCompare(b.name),
      );
  },
  saveProfile: async (uid, profile) => {
    await setDoc(doc(firestore(), 'users', uid), profile);
  },
}));
