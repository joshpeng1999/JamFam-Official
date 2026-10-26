import { onSnapshot, type Query, type Unsubscribe } from 'firebase/firestore';

export interface Subscription {
  unsubscribe: Unsubscribe;
  // Resolves once the first snapshot (or an error) arrives, so the splash
  // screen can wait for real data before showing the feed.
  firstLoad: Promise<void>;
}

/**
 * Live-subscribes to a Firestore query and hands every snapshot to `onData`
 * as plain objects with their doc id. At Jamfam's scale (~60 users) whole
 * collections fit comfortably in memory, so stores mirror them locally and
 * keep their existing synchronous getters.
 */
export function subscribeToQuery<T extends { id: string }>(
  query: Query,
  onData: (items: T[]) => void,
  label: string,
): Subscription {
  let resolveFirst: () => void = () => {};
  const firstLoad = new Promise<void>((resolve) => {
    resolveFirst = resolve;
  });

  const unsubscribe = onSnapshot(
    query,
    (snapshot) => {
      onData(snapshot.docs.map((d) => ({ ...(d.data() as Omit<T, 'id'>), id: d.id }) as T));
      resolveFirst();
    },
    (error) => {
      console.warn(`[firestore] ${label} listener failed:`, error.code, error.message);
      resolveFirst();
    },
  );

  return { unsubscribe, firstLoad };
}
