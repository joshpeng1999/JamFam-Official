import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { router, useIsFocused } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View, type ViewToken } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { ConnectSheet } from '../../components/feed/ConnectSheet';
import { FeedPostCard } from '../../components/feed/FeedPostCard';
import { FeedTopBar, type FeedTab } from '../../components/feed/FeedTopBar';
import type { Post } from '../../src/data/types';
import { useCurrentUserId } from '../../src/store/useAuthStore';
import { useConnectionsStore } from '../../src/store/useConnectionsStore';
import { usePostsStore } from '../../src/store/usePostsStore';
import { useProjectsStore } from '../../src/store/useProjectsStore';
import { useUsersStore } from '../../src/store/useUsersStore';
import { colors, spacing, typography } from '../../src/theme';

export default function FeedScreen() {
  const currentUserId = useCurrentUserId();
  const isFocused = useIsFocused();
  const [tab, setTab] = useState<FeedTab>('explore');
  const friendIds = useConnectionsStore(useShallow((s) => s.getAcceptedConnectionIds(currentUserId)));
  const posts = usePostsStore(
    useShallow((s) => {
      const feed = s.getFeedPosts(currentUserId);
      return tab === 'friends' ? feed.filter((p) => friendIds.includes(p.authorId)) : feed;
    }),
  );
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

  const changeTab = (next: FeedTab) => {
    setTab(next);
    setActiveIndex(0);
  };

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
        // Each feed starts from its top rather than the other feed's scroll position.
        key={tab}
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
            <Text style={[typography.title, styles.emptyTitle]}>
              {tab === 'friends' ? 'No posts from friends yet' : 'No posts yet'}
            </Text>
            <Text style={[typography.body, styles.emptyBody]}>
              {tab === 'friends'
                ? 'Posts from artists you’ve connected with will show up here.'
                : 'When other artists share their work it’ll show up here. Tap + to post yours.'}
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
              isActive={isFocused && index === activeIndex}
              onConnectPress={() => openConnectSheet(item)}
              onProjectPress={() => router.push(`/project/${item.projectId}`)}
              onAuthorPress={() => router.push(`/user/${item.authorId}`)}
            />
          );
        }}
      />

      <FeedTopBar tab={tab} onChangeTab={changeTab} />

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
