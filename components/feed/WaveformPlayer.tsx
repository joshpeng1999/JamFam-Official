import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, spacing } from '../../src/theme';
import { generateWaveformBars } from '../../src/utils/waveform';

interface WaveformPlayerProps {
  mediaUri: string;
  seed: number;
  isActive: boolean;
  barCount?: number;
}

export function WaveformPlayer({ mediaUri, seed, isActive, barCount = 48 }: WaveformPlayerProps) {
  const player = useAudioPlayer(mediaUri);
  const status = useAudioPlayerStatus(player);
  const bars = useMemo(() => generateWaveformBars(seed, barCount), [seed, barCount]);
  const progress = status.duration > 0 ? status.currentTime / status.duration : 0;
  const progressBarIndex = Math.floor(progress * barCount);

  useEffect(() => {
    if (!isActive && status.playing) {
      player.pause();
    }
  }, [isActive, player, status.playing]);

  useEffect(() => {
    return () => {
      player.pause();
    };
  }, [player]);

  const togglePlayback = () => {
    if (status.playing) {
      player.pause();
    } else {
      if (status.didJustFinish || status.currentTime >= status.duration) {
        player.seekTo(0);
      }
      player.play();
    }
  };

  return (
    <Pressable onPress={togglePlayback} style={styles.container}>
      {bars.map((height, index) => (
        <View
          key={index}
          style={[
            styles.bar,
            {
              height: `${height * 100}%`,
              backgroundColor: index <= progressBarIndex ? colors.accent : 'rgba(255,255,255,0.55)',
            },
          ]}
        />
      ))}
    </Pressable>
  );
}

const WAVEFORM_HEIGHT = 180;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: WAVEFORM_HEIGHT,
    marginTop: -WAVEFORM_HEIGHT / 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingHorizontal: spacing.xxl,
  },
  bar: {
    flex: 1,
    minHeight: 6,
    borderRadius: 2,
  },
});
