import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TypeCard } from '../../components/create/TypeCard';
import { useCreatePostDraftStore } from '../../src/store/useCreatePostDraftStore';
import { colors, radii, spacing, typography } from '../../src/theme';

export default function CreateTypeSelectScreen() {
  const insets = useSafeAreaInsets();
  const setField = useCreatePostDraftStore((s) => s.setField);
  const reset = useCreatePostDraftStore((s) => s.reset);
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();
  const initialized = useRef(false);

  // Fresh draft every time the create flow is entered, optionally
  // pre-selecting the project this was launched from (e.g. the "+" tile on
  // a project's detail screen).
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    reset();
    if (projectId) setField('projectId', projectId);
  }, [reset, setField, projectId]);

  return (
    <Pressable style={styles.backdrop} onPress={() => router.back()}>
      <LinearGradient colors={['#20140F', colors.background]} style={StyleSheet.absoluteFill} />
      <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + spacing.xl }]}>
        <View style={styles.handle} />
        <Text style={[typography.display, styles.title]}>Share your work.</Text>
        <Text style={[typography.body, styles.subtitle]}>Choose from three ways to share your projects.</Text>

        <View style={styles.cards}>
          <TypeCard
            icon="create-outline"
            title="Lyrics"
            description="Share a single line, song idea, or a full song's worth of inspiration"
            highlight="share your words"
            onPress={() => {
              setField('type', 'lyrics');
              router.push('/create/lyrics');
            }}
          />
          <TypeCard
            icon="pulse-outline"
            title="Audio"
            description="From a quick voice memo to a polished track in progress"
            highlight="share your sounds"
            onPress={() => {
              setField('type', 'audio');
              router.push('/create/audio-pick');
            }}
          />
          <TypeCard
            icon="videocam-outline"
            title="Video"
            description="Post anything from a raw jam session to a visualized performance"
            highlight="share your vision"
            onPress={() => {
              setField('type', 'video');
              router.push('/create/video-pick');
            }}
          />
        </View>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.sheetBackground,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.xs,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.sheetBorder,
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.sheetTextPrimary,
  },
  subtitle: {
    color: colors.sheetTextSecondary,
    marginBottom: spacing.md,
  },
  cards: {
    gap: spacing.md,
  },
});
