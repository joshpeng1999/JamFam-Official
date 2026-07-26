import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { router } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { CreateStepHeader } from '../../components/create/CreateStepHeader';
import { TrimSelector } from '../../components/create/TrimSelector';
import { MAX_CLIP_DURATION_SEC } from '../../src/data/types';
import { useCreatePostDraftStore } from '../../src/store/useCreatePostDraftStore';
import { colors, radii, spacing, typography } from '../../src/theme';
import { generateWaveformBars } from '../../src/utils/waveform';

export default function AudioTrimScreen() {
  const { title, mediaUri, durationSec, trimStartSec, trimEndSec, setField } = useCreatePostDraftStore();

  const player = useAudioPlayer(mediaUri);
  const status = useAudioPlayerStatus(player);
  const bars = useMemo(() => generateWaveformBars(mediaUri?.length ?? 1, 60), [mediaUri]);

  useEffect(() => {
    if (status.duration > 0 && status.duration !== durationSec) {
      setField('durationSec', status.duration);
      setField('trimEndSec', Math.min(status.duration, MAX_CLIP_DURATION_SEC));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status.duration]);

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
          <View style={styles.waveform}>
            {bars.map((height, index) => (
              <View key={index} style={[styles.bar, { height: `${height * 100}%` }]} />
            ))}
          </View>
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
    height: 220,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceAlt,
    justifyContent: 'center',
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    height: '70%',
    paddingHorizontal: spacing.lg,
  },
  bar: {
    flex: 1,
    minHeight: 4,
    borderRadius: 2,
    backgroundColor: colors.textSecondary,
  },
  caption: {
    color: colors.textTertiary,
    textAlign: 'center',
  },
});
