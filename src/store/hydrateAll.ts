import { useConnectionsStore } from './useConnectionsStore';
import { useConversationsStore } from './useConversationsStore';
import { usePostsStore } from './usePostsStore';
import { useProjectsStore } from './useProjectsStore';
import { useUsersStore } from './useUsersStore';

let activeUid: string | null = null;
let stopActive: (() => void) | null = null;

/**
 * Starts live Firestore listeners for every store, scoped to the signed-in
 * user, and resolves once each has delivered its first snapshot. Calling it
 * again for the same user is a no-op; for a different user it swaps over.
 */
export async function startDataSync(uid: string): Promise<void> {
  if (activeUid === uid && stopActive) return;
  stopDataSync();

  const subs = [
    useUsersStore.getState().subscribe(),
    useProjectsStore.getState().subscribe(),
    usePostsStore.getState().subscribe(),
    useConnectionsStore.getState().subscribe(uid),
    useConversationsStore.getState().subscribe(uid),
  ];
  activeUid = uid;
  stopActive = () => subs.forEach((s) => s.unsubscribe());

  await Promise.all(subs.map((s) => s.firstLoad));
}

/** Stops all listeners and clears local copies (used on sign-out). */
export function stopDataSync(): void {
  stopActive?.();
  stopActive = null;
  activeUid = null;
  useUsersStore.setState({ users: [] });
  useProjectsStore.setState({ projects: [] });
  usePostsStore.setState({ posts: [] });
  useConnectionsStore.setState({ requests: [] });
  useConversationsStore.setState({ conversations: [] });
}
