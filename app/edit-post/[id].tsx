import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CreateStepHeader } from '../../components/create/CreateStepHeader';
import { TextField } from '../../components/ui/TextField';
import type { Post } from '../../src/data/types';
import { useCurrentUserId } from '../../src/store/useAuthStore';
import { usePostsStore } from '../../src/store/usePostsStore';
import { colors, spacing, typography } from '../../src/theme';

export default function EditPostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const currentUserId = useCurrentUserId();
  const post = usePostsStore((s) => s.getPost(id));

  // Only the author can edit; the Firestore rules enforce this too.
  if (!post || post.authorId !== currentUserId) {
    return (
      <View style={styles.container}>
        <CreateStepHeader actionLabel="Save" actionDisabled onAction={() => {}} />
        <Text style={[typography.body, styles.missing]}>This post can’t be edited.</Text>
      </View>
    );
  }

  return <EditPostForm post={post} />;
}

function EditPostForm({ post }: { post: Post }) {
  const updatePost = usePostsStore((s) => s.updatePost);
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const [lyricsBody, setLyricsBody] = useState(post.lyricsBody ?? '');
  const [saving, setSaving] = useState(false);

  const isLyrics = post.type === 'lyrics';
  const changed =
    title.trim() !== post.title ||
    description.trim() !== post.description ||
    (isLyrics && lyricsBody.trim() !== (post.lyricsBody ?? ''));
  const canSave = changed && title.trim().length > 0 && (!isLyrics || lyricsBody.trim().length > 0);

  const save = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await updatePost(post.id, {
        title: title.trim(),
        description: description.trim(),
        ...(isLyrics ? { lyricsBody: lyricsBody.trim() } : {}),
      });
      router.back();
    } catch (error) {
      console.warn('[edit post] failed:', error);
      Alert.alert('Couldn’t save changes', 'Check your connection and try again.');
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <CreateStepHeader actionLabel="Save" actionDisabled={!canSave} actionLoading={saving} onAction={save} />
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <Text style={[typography.display, styles.heading]}>Edit Post</Text>
        <TextField label="Title" value={title} onChangeText={setTitle} placeholder="Post title" maxLength={80} />
        <TextField
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Add a description to your post (optional)"
          multiline
        />
        {isLyrics && (
          <TextField label="Lyrics" value={lyricsBody} onChangeText={setLyricsBody} placeholder="Lyrics" multiline />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  heading: {
    color: colors.textPrimary,
  },
  missing: {
    color: colors.textSecondary,
    paddingHorizontal: spacing.lg,
  },
});
