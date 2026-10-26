import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { create } from 'zustand';

import { firebaseAuth } from '../services/firebase';

interface AuthState {
  uid: string | null;
  email: string | null;
  // False until Firebase has restored (or ruled out) a persisted session.
  initialized: boolean;
  init: () => () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  uid: null,
  email: null,
  initialized: false,
  init: () =>
    onAuthStateChanged(firebaseAuth(), (user) => {
      set({ uid: user?.uid ?? null, email: user?.email ?? null, initialized: true });
    }),
  signIn: async (email, password) => {
    await signInWithEmailAndPassword(firebaseAuth(), email.trim(), password);
  },
  signUp: async (email, password) => {
    await createUserWithEmailAndPassword(firebaseAuth(), email.trim(), password);
  },
  resetPassword: async (email) => {
    await sendPasswordResetEmail(firebaseAuth(), email.trim());
  },
  signOut: async () => {
    await firebaseSignOut(firebaseAuth());
  },
}));

/**
 * The signed-in user's id. Only call this from screens behind the auth gate in
 * `app/index.tsx` (the tabs and create flow), where a user is guaranteed.
 */
export function useCurrentUserId(): string {
  const uid = useAuthStore((s) => s.uid);
  return uid ?? '';
}

/** Turns Firebase Auth error codes into something a person can act on. */
export function describeAuthError(error: unknown): string {
  const code = (error as { code?: string })?.code ?? '';
  switch (code) {
    case 'auth/invalid-email':
      return 'That email address doesn’t look right.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email or password is incorrect.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try signing in.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Wait a minute and try again.';
    case 'auth/network-request-failed':
      return 'Couldn’t reach the server. Check your connection.';
    default:
      return 'Something went wrong. Please try again.';
  }
}
