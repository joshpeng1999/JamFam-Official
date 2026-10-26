import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { CreateStepHeader } from '../../components/create/CreateStepHeader';
import { TagPickerSheet } from '../../components/create/TagPickerSheet';
import { Chip } from '../../components/ui/Chip';
import { PostThumbnail } from '../../components/ui/PostThumbnail';
import { UnsupportedFileError, UploadTooLargeError } from '../../src/services/mediaUpload';
import { useCurrentUserId } from '../../src/store/useAuthStore';
import { useCreatePostDraftStore } from '../../src/store/useCreatePostDraftStore';
import { usePostsStore } from '../../src/store/usePostsStore';
import { useProjectsStore } from '../../src/store/useProjectsStore';
import { colors, radii, spacing, typography } from '../../src/theme';

const NEW_PROJECT_KEY = '__new__';

export default function DetailsScreen() {
  const currentUserId = useCurrentUserId();
  const draft = useCreatePostDraftStore();
  const { setField } = draft;
  const createPost = usePostsStore((s) => s.createPost);
  const createProject = useProjectsStore((s) => s.createProject);
  const myProjects = useProjectsStore(useShallow((s) => s.getProjectsByOwner(currentUserId)));

  const [publishing, setPublishing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [creatingNewProject, setCreatingNewProject] = useState(!draft.projectId && myProjects.length === 0);
  const sheetRef = useRef<BottomSheetModal>(null);

  const pickCover = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!result.canceled && result.assets[0]) {
      setField('coverUri', result.assets[0].uri);
    }
  };

  const canPublish = draft.title.trim().length > 0 && (draft.projectId || draft.newProjectTitle.trim().length > 0);

  const publish = async () => {
    if (!canPublish || draft.type === null) return;
    setPublishing(true);

    try {
      let projectId = draft.projectId;
      if (!projectId) {
        const project = await createProject({
          ownerId: currentUserId,
          title: draft.newProjectTitle.trim() || draft.title,
        });
        projectId = project.id;
        // If the upload below fails, a retry reuses this project instead of
        // creating a duplicate.
        setField('projectId', project.id);
        setCreatingNewProject(false);
      }

      // Stays in the publish flow (no navigation) until the upload finishes so
      // a failed upload can simply be retried with Share.
      await createPost(
        {
          projectId,
          authorId: currentUserId,
          type: draft.type,
          title: draft.title.trim(),
          description: draft.description.trim(),
          mediaUri: draft.mediaUri ?? undefined,
          coverUri: draft.coverUri ?? undefined,
          lyricsBody: draft.lyricsBody || undefined,
          durationSec: draft.type === 'lyrics' ? undefined : draft.trimEndSec - draft.trimStartSec,
          trimStartSec: draft.type === 'lyrics' ? undefined : draft.trimStartSec,
          trimEndSec: draft.type === 'lyrics' ? undefined : draft.trimEndSec,
          lookingForTags: draft.tags,
        },
        setUploadProgress,
      );

      router.dismissTo('/(tabs)');
    } catch (error) {
      console.warn('[publish] failed:', error);
      Alert.alert(
        'Couldn’t share post',
        error instanceof UploadTooLargeError || error instanceof UnsupportedFileError
          ? error.message
          : 'Check your connection and try again.',
      );
    } finally {
      setPublishing(false);
      setUploadProgress(null);
    }
  };

  return (
    <View style={styles.container}>
      <CreateStepHeader actionLabel="Share" actionDisabled={!canPublish} actionLoading={publishing} onAction={publish} />

      {uploadProgress !== null && (
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.round(uploadProgress * 100)}%` }]} />
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable onPress={pickCover} style={styles.coverPicker}>
          {draft.coverUri ? (
            <Image source={{ uri: draft.coverUri }} style={StyleSheet.absoluteFill} contentFit="cover" />
          ) : (
            <Ionicons name="image-outline" size={32} color={colors.textTertiary} />
          )}
        </Pressable>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <View style={styles.titleThumb}>
              <PostThumbnail type={draft.type} mediaUri={draft.mediaUri} coverUri={draft.coverUri} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[typography.bodyStrong, styles.light]}>Post Title</Text>
              <Text style={[typography.body, styles.muted]} numberOfLines={1}>
                {draft.title || 'Untitled'}
              </Text>
            </View>
          </View>

          <TextInput
            value={draft.description}
            onChangeText={(text) => setField('description', text)}
            placeholder="Add a description to your post (optional)"
            placeholderTextColor={colors.textTertiary}
            multiline
            style={styles.descriptionInput}
          />

          <Pressable onPress={() => sheetRef.current?.present()} style={styles.tagButton}>
            <Ionicons name="pricetags-outline" size={18} color={colors.textPrimary} />
            <Text style={[typography.bodyStrong, styles.light]}>
              {draft.tags.length > 0 ? `Collaborator Tags (${draft.tags.length})` : 'Add Collaborator Tags'}
            </Text>
          </Pressable>
          {draft.tags.length > 0 && (
            <View style={styles.tagsRow}>
              {draft.tags.map((tag) => (
                <View key={tag} style={styles.tagChip}>
                  <Text style={[typography.caption, styles.light]}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          <Text style={[typography.bodyStrong, styles.light, styles.sectionLabel]}>Add to Project</Text>
          <View style={styles.tagsRow}>
            {myProjects.map((project) => (
              <Chip
                key={project.id}
                label={project.title}
                variant="dark"
                selected={draft.projectId === project.id}
                onPress={() => {
                  setField('projectId', project.id);
                  setCreatingNewProject(false);
                }}
              />
            ))}
            <Chip
              label="+ New Project"
              variant="dark"
              selected={creatingNewProject}
              onPress={() => {
                setField('projectId', null);
                setCreatingNewProject(true);
              }}
            />
          </View>
          {creatingNewProject && (
            <TextInput
              value={draft.newProjectTitle}
              onChangeText={(text) => setField('newProjectTitle', text)}
              placeholder="New project name"
              placeholderTextColor={colors.textTertiary}
              style={styles.newProjectInput}
            />
          )}
        </View>
      </ScrollView>

      <TagPickerSheet
        ref={sheetRef}
        selectedTags={draft.tags}
        onSave={(tags) => {
          setField('tags', tags);
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
  progressTrack: {
    height: 3,
    backgroundColor: colors.surfaceAlt,
  },
  progressFill: {
    height: 3,
    backgroundColor: colors.accent,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  coverPicker: {
    height: 200,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  titleThumb: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  light: {
    color: colors.textPrimary,
  },
  muted: {
    color: colors.textTertiary,
  },
  descriptionInput: {
    ...typography.body,
    color: colors.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  tagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
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
  sectionLabel: {
    marginTop: spacing.sm,
  },
  newProjectInput: {
    ...typography.body,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
  },
});
