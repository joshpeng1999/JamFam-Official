import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import type { Post, User } from '../../src/data/types';
import { usePostsStore } from '../../src/store/usePostsStore';
import { useProjectsStore } from '../../src/store/useProjectsStore';
import { colors, spacing, typography } from '../../src/theme';
import { AboutSection } from './AboutSection';
import { PostGrid } from './PostGrid';
import { ProfileHeader } from './ProfileHeader';
import { ProfileTabs, type ProfileTab } from './ProfileTabs';
import { ProjectCard } from './ProjectCard';

interface ProfileScreenBodyProps {
  user: User;
  isOwnProfile: boolean;
  isConnected?: boolean;
  onPrimaryAction: () => void;
}

const COLUMNS = 2;
const GAP = spacing.md;

export function ProfileScreenBody({ user, isOwnProfile, isConnected, onPrimaryAction }: ProfileScreenBodyProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [tab, setTab] = useState<ProfileTab>('projects');

  const posts = usePostsStore(useShallow((s) => s.getPostsByAuthor(user.id)));
  const projects = useProjectsStore(useShallow((s) => s.getProjectsByOwner(user.id)));
  const getPostsByProject = usePostsStore((s) => s.getPostsByProject);

  const projectCardWidth = (width - spacing.lg * 2 - GAP * (COLUMNS - 1)) / COLUMNS;

  const openPost = (post: Post) => {
    router.push(`/profile/project/${post.projectId}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top }}>
      <ProfileHeader user={user} isOwnProfile={isOwnProfile} isConnected={isConnected} onPrimaryAction={onPrimaryAction} />
      <ProfileTabs active={tab} onChange={setTab} />

      {tab === 'posts' && <PostGrid posts={posts} onPressPost={openPost} />}

      {tab === 'projects' && (
        <View style={styles.projectGrid}>
          {projects.length === 0 ? (
            <Text style={[typography.body, styles.empty]}>No projects yet.</Text>
          ) : (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                posts={getPostsByProject(project.id)}
                width={projectCardWidth}
                onPress={() => router.push(`/profile/project/${project.id}`)}
              />
            ))
          )}
        </View>
      )}

      {tab === 'about' && <AboutSection user={user} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  projectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  empty: {
    color: colors.textTertiary,
    paddingVertical: spacing.xxxl,
  },
});
