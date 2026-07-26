import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import type { PostType } from '../../src/data/types';
import { colors } from '../../src/theme';

const TYPE_ICON: Record<PostType, keyof typeof Ionicons.glyphMap> = {
  video: 'videocam',
  audio: 'musical-notes',
  lyrics: 'document-text',
};

interface PostThumbnailProps {
  type: PostType | null;
  mediaUri?: string | null;
  coverUri?: string | null;
  iconSize?: number;
}

// Shows the post's cover image if one was set; otherwise, video posts get an
// auto-generated frame from the clip itself. Audio/lyrics posts without a
// cover fall back to a plain type icon — there's no frame to pull from.
export function PostThumbnail({ type, mediaUri, coverUri, iconSize = 22 }: PostThumbnailProps) {
  const [videoFrameUri, setVideoFrameUri] = useState<string | null>(null);

  useEffect(() => {
    if (coverUri || type !== 'video' || !mediaUri) return;
    let cancelled = false;
    VideoThumbnails.getThumbnailAsync(mediaUri, { time: 0 })
      .then((result) => {
        if (!cancelled) setVideoFrameUri(result.uri);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [coverUri, type, mediaUri]);

  const displayUri = coverUri ?? videoFrameUri;
  if (displayUri) {
    return <Image source={{ uri: displayUri }} style={StyleSheet.absoluteFill} contentFit="cover" />;
  }
  return (
    <View style={styles.fallback}>
      <Ionicons name={type ? TYPE_ICON[type] : 'image-outline'} size={iconSize} color={colors.textTertiary} />
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
