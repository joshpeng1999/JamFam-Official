import { router } from 'expo-router';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { CreateStepHeader } from '../../components/create/CreateStepHeader';
import { useCreatePostDraftStore } from '../../src/store/useCreatePostDraftStore';
import { colors, spacing, typography } from '../../src/theme';

export default function LyricsScreen() {
  const { title, lyricsBody, setField } = useCreatePostDraftStore();
  const canContinue = title.trim().length > 0 && lyricsBody.trim().length > 0;

  return (
    <View style={styles.container}>
      <CreateStepHeader
        actionLabel="Next"
        actionDisabled={!canContinue}
        onAction={() => router.push('/create/details')}
      />

      <View style={styles.body}>
        <Text style={[typography.display, styles.heading]}>Title your work</Text>
        <TextInput
          value={title}
          onChangeText={(text) => setField('title', text)}
          placeholder="Untitled Project"
          placeholderTextColor={colors.textTertiary}
          style={styles.titleInput}
        />

        <TextInput
          value={lyricsBody}
          onChangeText={(text) => setField('lyricsBody', text)}
          placeholder="Share a single line, a verse, or a full song's worth of words…"
          placeholderTextColor={colors.textTertiary}
          multiline
          textAlignVertical="top"
          style={styles.lyricsInput}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  heading: {
    color: colors.textPrimary,
  },
  titleInput: {
    ...typography.subtitle,
    color: colors.textPrimary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm,
  },
  lyricsInput: {
    ...typography.body,
    flex: 1,
    color: colors.textPrimary,
    lineHeight: 24,
  },
});
