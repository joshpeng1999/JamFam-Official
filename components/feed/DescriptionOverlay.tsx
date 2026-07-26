import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Post, Project, User } from '../../src/data/types';
import { colors, radii, spacing, typography } from '../../src/theme';
import { timeAgo } from '../../src/utils/format';
import { Avatar } from '../ui/Avatar';
import { PrimaryButton } from '../ui/PrimaryButton';

interface DescriptionOverlayProps {
  post: Post;
  author: User;
  project?: Project;
  projectPostCount: number;
  expanded: boolean;
  onToggleExpand: () => void;
  onConnectPress: () => void;
  onProjectPress: () => void;
  onAuthorPress: () => void;
}

export function DescriptionOverlay({
  post,
  author,
  project,
  projectPostCount,
  expanded,
  onToggleExpand,
  onConnectPress,
  onProjectPress,
  onAuthorPress,
}: DescriptionOverlayProps) {
  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <LinearGradient
        colors={['transparent', colors.overlayScrimStrong]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={styles.content}>
        <Text style={[typography.title, styles.title]}>{post.title}</Text>

        <Pressable onPress={onToggleExpand}>
          <Text style={[typography.body, styles.description]} numberOfLines={expanded ? undefined : 2}>
            {post.description}
            {!expanded && <Text style={styles.more}>  ...more</Text>}
          </Text>
        </Pressable>

        {expanded && (
          <>
            {post.lookingForTags.length > 0 && (
              <View style={styles.tagsBlock}>
                <Text style={[typography.bodyStrong, styles.tagsLabel]}>Looking for</Text>
                <View style={styles.tagsRow}>
                  {post.lookingForTags.map((tag) => (
                    <View key={tag} style={styles.tagChip}>
                      <Text style={[typography.caption, styles.tagChipText]}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {project && (
              <Pressable onPress={onProjectPress} style={styles.projectCard}>
                <View style={styles.projectThumb} />
                <View style={styles.projectInfo}>
                  <Text style={[typography.bodyStrong, styles.title]}>{project.title}</Text>
                  <Text style={[typography.caption, styles.description]}>
                    {projectPostCount} Posts · Updated {timeAgo(project.updatedAt)}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </Pressable>
            )}
          </>
        )}

        <View style={styles.authorRow}>
          <Pressable style={styles.authorInfo} onPress={onAuthorPress}>
            <Avatar name={author.name} color={author.avatarColor} size={40} />
            <View>
              <Text style={[typography.bodyStrong, styles.title]}>{author.name}</Text>
              <Text style={[typography.caption, styles.description]}>{author.roles.slice(0, 2).join(' · ')}</Text>
            </View>
          </Pressable>
          {!expanded && (
            <Pressable onPress={onConnectPress} style={styles.quickConnect} hitSlop={8}>
              <Ionicons name="person-add" size={16} color={colors.textPrimary} />
            </Pressable>
          )}
        </View>

        {expanded && (
          <PrimaryButton
            label="Get Connected"
            variant="inverted"
            icon={<Ionicons name="person-add" size={18} color={colors.background} />}
            onPress={onConnectPress}
            style={styles.connectButton}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.xxxl,
    gap: spacing.sm,
  },
  title: {
    color: colors.textPrimary,
  },
  description: {
    color: colors.textSecondary,
  },
  more: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  tagsBlock: {
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  tagsLabel: {
    color: colors.textPrimary,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tagChip: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  tagChipText: {
    color: colors.textPrimary,
  },
  projectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    marginTop: spacing.xs,
  },
  projectThumb: {
    width: 44,
    height: 44,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceAlt,
  },
  projectInfo: {
    flex: 1,
    gap: 2,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  authorInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  quickConnect: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectButton: {
    marginTop: spacing.sm,
  },
});
