import { useConnectionsStore } from './useConnectionsStore';
import { useConversationsStore } from './useConversationsStore';
import { usePostsStore } from './usePostsStore';
import { useProjectsStore } from './useProjectsStore';

export async function hydrateAllStores(): Promise<void> {
  await Promise.all([
    useProjectsStore.getState().hydrate(),
    usePostsStore.getState().hydrate(),
    useConnectionsStore.getState().hydrate(),
    useConversationsStore.getState().hydrate(),
  ]);
}
