import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useEffect, useMemo, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, spacing } from '../../src/theme';
import { generateWaveformBars } from '../../src/utils/waveform';

interface WaveformPlayerProps {
  mediaUri: string;
  seed: number;
  isActive: boolean;
  barCount?: number;
  onProgress?: (currentTime: number, duration: number) => void;
}

export function WaveformPlayer({ mediaUri, seed, isActive, barCount = 48, onProgress }: WaveformPlayerProps) {
  const player = useAudioPlayer(mediaUri);
  const status = useAudioPlayerStatus(player);
  const bars = useMemo(() => generateWaveformBars(seed, barCount), [seed, barCount]);
  const progress = status.duration > 0 ? status.currentTime / status.duration : 0;
  const progressBarIndex = Math.floor(progress * barCount);

  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  useEffect(() => {
    if (status.isLoaded) {
      onProgressRef.current?.(status.currentTime, status.duration);
    }
  }, [status.isLoaded, status.currentTime, status.duration]);

  // Swiping away pauses and rewinds, so the post starts from 0:00 next time.
  useEffect(() => {
    if (!isActive) {
      player.pause();
      player.seekTo(0).catch(() => {});
    }
  }, [isActive, player]);

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
