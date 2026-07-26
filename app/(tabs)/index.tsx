import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { FlatList, StyleSheet, View, type ViewToken } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { ConnectSheet } from '../../components/feed/ConnectSheet';
import { FeedPostCard } from '../../components/feed/FeedPostCard';
import { FeedTopBar } from '../../components/feed/FeedTopBar';
import { CURRENT_USER_ID, type Post } from '../../src/data/types';
import { useConnectionsStore } from '../../src/store/useConnectionsStore';
import { usePostsStore } from '../../src/store/usePostsStore';
import { useProjectsStore } from '../../src/store/useProjectsStore';
import { useUsersStore } from '../../src/store/useUsersStore';
import { colors } from '../../src/theme';

export default function FeedScreen() {
  const posts = usePostsStore(useShallow((s) => s.getFeedPosts(CURRENT_USER_ID)));
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
            fromUserId: CURRENT_USER_ID,
            toUserId: connectTarget.authorId,
            postId: connectTarget.id,
            message,
          });
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
});
