import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import { PostGrid } from '../../../../components/profile/PostGrid';
import { Avatar } from '../../../../components/ui/Avatar';
import { Pill } from '../../../../components/ui/Pill';
import { usePostsStore } from '../../../../src/store/usePostsStore';
import { useProjectsStore } from '../../../../src/store/useProjectsStore';
import { useUsersStore } from '../../../../src/store/useUsersStore';
import { colors, spacing, typography } from '../../../../src/theme';

export default function ProjectDetailScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();
  const project = useProjectsStore((s) => s.getProject(id));
  const posts = usePostsStore(useShallow((s) => s.getPostsByProject(id)));
  const getUser = useUsersStore((s) => s.getUser);

  if (!project) return null;

  const collaborators = project.collaboratorIds.map((cid) => getUser(cid)).filter((u): u is NonNullable<typeof u> => !!u);
  const addTileSize = (width - spacing.lg * 2 - 2 * 2) / 3;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top + spacing.md }}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Pill label={project.status === 'completed' ? 'Completed' : 'In Progress'} tone={project.status === 'completed' ? 'green' : 'blue'} />
      </View>

      <View style={styles.body}>
        <Text style={[typography.display, styles.light]}>{project.title}</Text>
        {!!project.description && <Text style={[typography.body, styles.muted]}>{project.description}</Text>}

        {collaborators.length > 0 && (
          <View style={styles.collaboratorsRow}>
            <View style={styles.avatarStack}>
              {collaborators.slice(0, 4).map((user, index) => (
                <View key={user.id} style={[styles.avatarWrap, { marginLeft: index === 0 ? 0 : -12 }]}>
                  <Avatar name={user.name} color={user.avatarColor} size={28} />
                </View>
              ))}
            </View>
            <Text style={[typography.caption, styles.muted]}>
              {collaborators[0]?.name}
              {collaborators.length > 1 ? ` + ${collaborators.length - 1} more` : ''}
            </Text>
          </View>
        )}
      </View>

      <PostGrid posts={posts} onPressPost={() => {}} />

      <View style={styles.addTileRow}>
        <Pressable
          onPress={() => router.push({ pathname: '/create', params: { projectId: project.id } })}
          style={[styles.addTile, { width: addTileSize, height: addTileSize }]}
        >
          <Ionicons name="add" size={28} color={colors.textTertiary} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.xs,
  },
  light: {
    color: colors.textPrimary,
  },
  muted: {
    color: colors.textSecondary,
  },
  collaboratorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  avatarStack: {
    flexDirection: 'row',
  },
  avatarWrap: {
    borderWidth: 2,
    borderColor: colors.background,
    borderRadius: 16,
  },
  addTileRow: {
    paddingHorizontal: spacing.lg,
    marginTop: -spacing.sm,
    paddingBottom: spacing.xxxl,
  },
  addTile: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
