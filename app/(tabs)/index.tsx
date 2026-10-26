import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View, type ViewToken } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { ConnectSheet } from '../../components/feed/ConnectSheet';
import { FeedPostCard } from '../../components/feed/FeedPostCard';
import { FeedTopBar } from '../../components/feed/FeedTopBar';
import type { Post } from '../../src/data/types';
import { useCurrentUserId } from '../../src/store/useAuthStore';
import { useConnectionsStore } from '../../src/store/useConnectionsStore';
import { usePostsStore } from '../../src/store/usePostsStore';
import { useProjectsStore } from '../../src/store/useProjectsStore';
import { useUsersStore } from '../../src/store/useUsersStore';
import { colors, spacing, typography } from '../../src/theme';

export default function FeedScreen() {
  const currentUserId = useCurrentUserId();
  const posts = usePostsStore(useShallow((s) => s.getFeedPosts(currentUserId)));
  const getPostsByProject = usePostsStore((s) => s.getPostsByProject);
  const getUser = useUsersStore((s) => s.getUser);
  const getProject = useProjectsStore((s) => s.getProject);
  const sendConnectionRequest = useConnectionsStore((s) => s.sendConnectionRequest);

  const [containerHeight, setContainerHeight] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [connectTarget, setConnectTarget] = useState<Post | null>(null);
  const sheetRef = useRef<BottomSheetModal>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index != null) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const openConnectSheet = useCallback((post: Post) => {
    setConnectTarget(post);
    sheetRef.current?.present();
  }, []);

  const author = connectTarget ? getUser(connectTarget.authorId) : undefined;

  if (containerHeight === 0) {
    return <View style={styles.container} onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)} />;
  }

  return (
    <View style={styles.container} onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={containerHeight}
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
        getItemLayout={(_, index) => ({ length: containerHeight, offset: containerHeight * index, index })}
        ListEmptyComponent={
          <View style={[styles.empty, { height: containerHeight }]}>
            <Text style={[typography.title, styles.emptyTitle]}>No posts yet</Text>
            <Text style={[typography.body, styles.emptyBody]}>
              When other artists share their work it’ll show up here. Tap + to post yours.
            </Text>
          </View>
        }
        renderItem={({ item, index }) => {
          const author = getUser(item.authorId);
          const project = getProject(item.projectId);
          if (!author) return null;
          return (
            <FeedPostCard
              post={item}
              author={author}
              project={project}
              projectPostCount={getPostsByProject(item.projectId).length}
              height={containerHeight}
              isActive={index === activeIndex}
              onConnectPress={() => openConnectSheet(item)}
              onProjectPress={() => router.push(`/profile/project/${item.projectId}`)}
              onAuthorPress={() => router.push(`/profile/user/${item.authorId}`)}
            />
          );
        }}
      />

      <FeedTopBar />

      <ConnectSheet
        ref={sheetRef}
        post={connectTarget}
        author={author ?? null}
        onSend={(message) => {
          if (!connectTarget) return;
          sendConnectionRequest({
            fromUserId: currentUserId,
            toUserId: connectTarget.authorId,
            postId: connectTarget.id,
            message,
          }).catch(() => Alert.alert('Couldn’t send request', 'Check your connection and try again.'));
          sheetRef.current?.dismiss();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    gap: spacing.sm,
  },
  emptyTitle: {
    color: colors.textPrimary,
  },
  emptyBody: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
