// `firebase/auth` resolves to its React Native build under Metro (which
// exports `getReactNativePersistence`), but TypeScript reads the browser
// typings, which don't declare it.
import type { Persistence, ReactNativeAsyncStorage } from 'firebase/auth';

declare module 'firebase/auth' {
  export function getReactNativePersistence(storage: ReactNativeAsyncStorage): Persistence;
}
