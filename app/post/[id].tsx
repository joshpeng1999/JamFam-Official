import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { router, useIsFocused, useLocalSearchParams } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, View, type ViewToken } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import { ConnectSheet } from '../../components/feed/ConnectSheet';
import { FeedPostCard } from '../../components/feed/FeedPostCard';
import type { Post } from '../../src/data/types';
import { useCurrentUserId } from '../../src/store/useAuthStore';
import { useConnectionsStore } from '../../src/store/useConnectionsStore';
import { usePostsStore } from '../../src/store/usePostsStore';
import { useProjectsStore } from '../../src/store/useProjectsStore';
import { useUsersStore } from '../../src/store/useUsersStore';
import { colors, spacing } from '../../src/theme';

// Full-screen player for a post opened from a grid. Swiping moves through the
// other posts from the same place: the project's posts by default, or the
// author's posts when opened from a profile's Posts tab (scope=author).
export default function PostViewerScreen() {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const { id, scope } = useLocalSearchParams<{ id: string; scope?: 'project' | 'author' }>();
  const currentUserId = useCurrentUserId();

  const startPost = usePostsStore((s) => s.getPost(id));
  const posts = usePostsStore(
    useShallow((s) => {
      if (!startPost) return [];
      return scope === 'author' ? s.getPostsByAuthor(startPost.authorId) : s.getPostsByProject(startPost.projectId);
    }),
  );
  const getPostsByProject = usePostsStore((s) => s.getPostsByProject);
  const getUser = useUsersStore((s) => s.getUser);
  const getProject = useProjectsStore((s) => s.getProject);
  const sendConnectionRequest = useConnectionsStore((s) => s.sendConnectionRequest);

  const startIndex = Math.max(0, posts.findIndex((p) => p.id === id));
  const [containerHeight, setContainerHeight] = useState(0);
  const [activeIndex, setActiveIndex] = useState(startIndex);
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

  const connectAuthor = connectTarget ? getUser(connectTarget.authorId) : undefined;

  const backButton = (
    <Pressable
      onPress={() => router.back()}
      hitSlop={12}
      style={[styles.backButton, { top: insets.top + spacing.sm }]}
    >
      <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
    </Pressable>
  );

  if (!startPost || containerHeight === 0) {
    return (
      <View style={styles.container} onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}>
        {backButton}
      </View>
    );
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
        initialScrollIndex={startIndex}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
        getItemLayout={(_, index) => ({ length: containerHeight, offset: containerHeight * index, index })}
        renderItem={({ item, index }) => {
          const author = getUser(item.authorId);
          if (!author) return null;
          return (
            <FeedPostCard
              post={item}
              author={author}
              project={getProject(item.projectId)}
              projectPostCount={getPostsByProject(item.projectId).length}
              height={containerHeight}
              isActive={isFocused && index === activeIndex}
              onConnectPress={() => openConnectSheet(item)}
              onProjectPress={() =>
                scope === 'author' ? router.push(`/project/${item.projectId}`) : router.back()
              }
              onAuthorPress={() => router.push(`/user/${item.authorId}`)}
            />
          );
        }}
      />

      {backButton}

      <ConnectSheet
        ref={sheetRef}
        post={connectTarget}
        author={connectAuthor ?? null}
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
  backButton: {
    position: 'absolute',
    left: spacing.lg,
    zIndex: 10,
  },
});
