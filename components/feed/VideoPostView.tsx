import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet } from 'react-native';

interface VideoPostViewProps {
  mediaUri: string;
  isActive: boolean;
  onProgress?: (currentTime: number, duration: number) => void;
}

export function VideoPostView({ mediaUri, isActive, onProgress }: VideoPostViewProps) {
  const player = useVideoPlayer(mediaUri, (instance) => {
    instance.loop = true;
    instance.muted = false;
    instance.timeUpdateEventInterval = 0.25;
  });

  const timeUpdate = useEvent(player, 'timeUpdate', {
    currentTime: 0,
    currentLiveTimestamp: null,
    currentOffsetFromLive: null,
    bufferedPosition: 0,
  });
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  useEffect(() => {
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, player]);

  // Read the latest onProgress via a ref rather than depending on it directly —
  // it's a fresh inline closure from the parent on every render, and depending
  // on it here would re-fire this effect every render, driving an infinite
  // render loop through the parent's setState.
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  useEffect(() => {
    onProgressRef.current?.(timeUpdate?.currentTime ?? 0, player.duration);
  }, [timeUpdate, player.duration]);

  const togglePlayback = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  return (
    <Pressable style={StyleSheet.absoluteFill} onPress={togglePlayback}>
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        nativeControls={false}
        pointerEvents="none"
      />
    </Pressable>
  );
}
