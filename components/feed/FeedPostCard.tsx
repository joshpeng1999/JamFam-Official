import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import type { Post, Project, User } from '../../src/data/types';
import { colors, spacing, typography } from '../../src/theme';
import { formatDuration } from '../../src/utils/format';
import { DescriptionOverlay } from './DescriptionOverlay';
import { VideoPostView } from './VideoPostView';
import { WaveformPlayer } from './WaveformPlayer';

interface FeedPostCardProps {
  post: Post;
  author: User;
  project?: Project;
  projectPostCount: number;
  height: number;
  isActive: boolean;
  onConnectPress: () => void;
  onProjectPress: () => void;
  onAuthorPress: () => void;
}

const ART_GRADIENTS: Record<number, [string, string]> = {
  0: ['#2B1B12', '#0A0A0A'],
  1: ['#1B2B2B', '#0A0A0A'],
  2: ['#2B1B2B', '#0A0A0A'],
};

export function FeedPostCard({
  post,
  author,
  project,
  projectPostCount,
  height,
  isActive,
  onConnectPress,
  onProjectPress,
  onAuthorPress,
}: FeedPostCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState({ currentTime: 0, duration: post.durationSec ?? 0 });
  const { width } = useWindowDimensions();
  const artGradient = ART_GRADIENTS[post.waveformSeed % 3];

  return (
    <View style={{ height, width }}>
      <View style={StyleSheet.absoluteFill}>
        {post.type === 'video' && post.mediaUri && (
          <VideoPostView
            mediaUri={post.mediaUri}
            isActive={isActive}
            onProgress={(currentTime, duration) => setProgress({ currentTime, duration })}
          />
        )}
        {post.type === 'audio' && post.mediaUri && (
          <>
            <LinearGradient colors={artGradient} style={StyleSheet.absoluteFill} />
            <WaveformPlayer mediaUri={post.mediaUri} seed={post.waveformSeed} isActive={isActive} />
          </>
        )}
        {post.type === 'lyrics' && (
          <LinearGradient colors={artGradient} style={StyleSheet.absoluteFill}>
            <ScrollView contentContainerStyle={styles.lyricsContainer}>
              <Text style={styles.lyricsText}>{post.lyricsBody}</Text>
            </ScrollView>
          </LinearGradient>
        )}
      </View>

      {post.type !== 'lyrics' && (
        <View style={styles.timestamp} pointerEvents="none">
          <Text style={styles.timestampText}>
            {formatDuration(progress.currentTime)}/{formatDuration(progress.duration || post.durationSec || 0)}
          </Text>
        </View>
      )}

      <DescriptionOverlay
        post={post}
        author={author}
        project={project}
        projectPostCount={projectPostCount}
        expanded={expanded}
        onToggleExpand={() => setExpanded((v) => !v)}
        onConnectPress={onConnectPress}
        onProjectPress={onProjectPress}
        onAuthorPress={onAuthorPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  timestamp: {
    position: 'absolute',
    left: spacing.lg,
    top: spacing.xxxl + spacing.xl,
  },
  timestampText: {
    ...typography.caption,
    color: colors.textPrimary,
  },
  lyricsContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingBottom: 160,
  },
  lyricsText: {
    ...typography.title,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 32,
  },
});
