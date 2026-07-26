import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import type { Post } from '../../src/data/types';
import { colors, spacing, typography } from '../../src/theme';
import { PostThumbnail } from '../ui/PostThumbnail';

const COLUMNS = 3;
const GAP = 2;

const TYPE_ICON: Record<Post['type'], keyof typeof Ionicons.glyphMap> = {
  video: 'videocam',
  audio: 'musical-notes',
  lyrics: 'document-text',
};

interface PostGridProps {
  posts: Post[];
  onPressPost: (post: Post) => void;
}

export function PostGrid({ posts, onPressPost }: PostGridProps) {
  const { width } = useWindowDimensions();
  const cellSize = (width - spacing.lg * 2 - GAP * (COLUMNS - 1)) / COLUMNS;

  if (posts.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={[typography.body, styles.emptyText]}>No posts yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      {posts.map((post) => (
        <Pressable key={post.id} onPress={() => onPressPost(post)} style={{ width: cellSize, height: cellSize }}>
          <View style={styles.cell}>
            <PostThumbnail type={post.type} mediaUri={post.mediaUri} coverUri={post.coverUri} />
          </View>
          <View style={styles.badge}>
            <Ionicons name={TYPE_ICON[post.type]} size={11} color={colors.textPrimary} />
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  cell: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  badge: {
    position: 'absolute',
    right: 4,
    top: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 4,
    padding: 2,
  },
  empty: {
    paddingVertical: spacing.xxxl,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textTertiary,
  },
});
