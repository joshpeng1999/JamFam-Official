import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth, type Auth } from 'firebase/auth';
import { getFirestore, initializeFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// Config comes from `EXPO_PUBLIC_FIREBASE_*` vars in `.env` (see `.env.example`).
// These values are not secrets — Firebase web config is meant to ship in the
// app; access is enforced by `firestore.rules` and `storage.rules`.
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.storageBucket,
);

function createServices() {
  const isFirstInit = getApps().length === 0;
  const app: FirebaseApp = isFirstInit ? initializeApp(firebaseConfig) : getApp();

  // `initialize*` may only run once per app; on a fast refresh the app already
  // exists, so fall back to the getters for the already-initialized instances.
  const auth: Auth = isFirstInit
    ? initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })
    : getAuth(app);
  // `ignoreUndefinedProperties` lets us write our optional TS fields (e.g.
  // `post.coverUri`) straight to Firestore without stripping `undefined`s.
  const db: Firestore = isFirstInit
    ? initializeFirestore(app, { ignoreUndefinedProperties: true })
    : getFirestore(app);
  const storage: FirebaseStorage = getStorage(app);

  return { app, auth, db, storage };
}

// Only initialize when configured, so the app can show a friendly setup
// message (see `app/index.tsx`) instead of crashing on a missing `.env`.
const services = isFirebaseConfigured ? createServices() : null;

function requireServices() {
  if (!services) {
    throw new Error('Firebase is not configured. Copy .env.example to .env and fill in your project values.');
  }
  return services;
}

export const firebaseAuth = () => requireServices().auth;
export const firestore = () => requireServices().db;
export const firebaseStorage = () => requireServices().storage;
