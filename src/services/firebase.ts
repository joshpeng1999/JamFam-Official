import { getApps, initializeApp, type FirebaseOptions } from 'firebase/app';

// --- Firebase swap-in point -------------------------------------------------
// The rest of the app talks to the mock, AsyncStorage-backed zustand stores in
// `src/store/`. To go live:
//   1. Fill in the config below (or read it from app config / env vars).
//   2. Replace each store's mock CRUD calls with the matching
//      firebase/firestore (and firebase/auth, firebase/storage) calls.
// `firebaseApp` stays `null` until real config is supplied, so importing this
// file is always safe even before Firebase is configured.
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const isConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

export const firebaseApp =
  isConfigured && getApps().length === 0 ? initializeApp(firebaseConfig) : null;

export const isFirebaseConfigured = isConfigured;
