import { router } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { CreateStepHeader } from '../../components/create/CreateStepHeader';
import { TrimSelector } from '../../components/create/TrimSelector';
import { MAX_CLIP_DURATION_SEC } from '../../src/data/types';
import { useCreatePostDraftStore } from '../../src/store/useCreatePostDraftStore';
import { colors, radii, spacing, typography } from '../../src/theme';

export default function VideoTrimScreen() {
  const { title, mediaUri, durationSec, trimStartSec, trimEndSec, setField } = useCreatePostDraftStore();

  const player = useVideoPlayer(mediaUri, (instance) => {
    instance.loop = true;
    instance.muted = true;
    instance.play();
  });

  const canContinue = title.trim().length > 0;

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

        <View style={styles.previewBox}>
          <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls={false} />
        </View>

        <TrimSelector
          durationSec={durationSec}
          maxWindowSec={MAX_CLIP_DURATION_SEC}
          startSec={trimStartSec}
          endSec={trimEndSec}
          onChange={(start, end) => {
            setField('trimStartSec', start);
            setField('trimEndSec', end);
          }}
        />

        <Text style={[typography.caption, styles.caption]}>Trim up to {MAX_CLIP_DURATION_SEC} seconds</Text>
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
  previewBox: {
    height: 320,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceAlt,
    overflow: 'hidden',
  },
  caption: {
    color: colors.textTertiary,
    textAlign: 'center',
  },
});
