import { create } from 'zustand';

import { seedUsers } from '../data/seed';
import type { User } from '../data/types';

interface UsersState {
  users: User[];
  getUser: (id: string) => User | undefined;
}

// Users aren't created/edited from within the app yet (no auth/edit-profile
// flow in scope), so this store is a simple read-only lookup over seed data —
// the same shape a `users` Firestore collection query would return.
export const useUsersStore = create<UsersState>((set, get) => ({
  users: seedUsers,
  getUser: (id) => get().users.find((u) => u.id === id),
}));
