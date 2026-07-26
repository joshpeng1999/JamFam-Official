import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Post, Project } from '../../src/data/types';
import { colors, radii, spacing, typography } from '../../src/theme';
import { timeAgo } from '../../src/utils/format';
import { PostThumbnail } from '../ui/PostThumbnail';

interface ProjectCardProps {
  project: Project;
  posts: Post[];
  width: number;
  onPress: () => void;
}

export function ProjectCard({ project, posts, width, onPress }: ProjectCardProps) {
  const previewPosts = posts.slice(0, 4);
  const previewCount = Math.max(previewPosts.length, 1);

  return (
    <Pressable onPress={onPress} style={{ width }}>
      <View style={[styles.thumbGrid, { width, height: width }]}>
        {previewPosts.length === 0 ? (
          <View style={[styles.thumbCell, styles.thumbCellSingle]} />
        ) : (
          previewPosts.map((post) => (
            <View key={post.id} style={[styles.thumbCell, previewCount === 1 && styles.thumbCellSingle]}>
              <PostThumbnail type={post.type} mediaUri={post.mediaUri} coverUri={post.coverUri} iconSize={16} />
            </View>
          ))
        )}
      </View>
      <Text style={[typography.bodyStrong, styles.title]} numberOfLines={1}>
        {project.title}
      </Text>
      <Text style={[typography.caption, styles.meta]}>
        {posts.length} {posts.length === 1 ? 'Post' : 'Posts'} · Updated {timeAgo(project.updatedAt)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  thumbGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: radii.md,
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
  },
  thumbCell: {
    width: '50%',
    height: '50%',
    borderWidth: 0.5,
    borderColor: colors.background,
    backgroundColor: colors.surfaceAlt,
  },
  thumbCellSingle: {
    width: '100%',
    height: '100%',
  },
  title: {
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  meta: {
    color: colors.textTertiary,
  },
});
