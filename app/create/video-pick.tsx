import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library/legacy';
import { router } from 'expo-router';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCreatePostDraftStore } from '../../src/store/useCreatePostDraftStore';
import { colors, spacing, typography } from '../../src/theme';
import { formatDuration } from '../../src/utils/format';

const COLUMNS = 3;
const GAP = 2;

// expo-media-library's default export (SDK 57+) is a new async Query/Asset
// API where duration/uri require separate awaited calls per asset — too
// slow for a grid of dozens of items, and `getAssetsAsync` on that entry
// point now throws at runtime telling you to use this one instead. The
// `/legacy` entry point keeps the pre-Query API, which returns plain
// objects with `uri`/`duration` synchronously.
type LegacyAsset = Awaited<ReturnType<typeof MediaLibrary.getAssetsAsync>>['assets'][number];

// expo-media-library's Asset.uri is a `ph://` asset-library reference on
// iOS, not a real file path — AVFoundation (what both expo-video-thumbnails
// and expo-video use under the hood) can't open that scheme directly, so
// thumbnailing and playback both silently fail on it. getAssetInfoAsync
// resolves it to a real, playable `localUri`.
async function resolvePlayableUri(asset: LegacyAsset): Promise<string> {
  const info = await MediaLibrary.getAssetInfoAsync(asset);
  return info.localUri ?? asset.uri;
}

function VideoThumb({ asset }: { asset: LegacyAsset }) {
  const [thumbUri, setThumbUri] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const playableUri = await resolvePlayableUri(asset);
        const result = await VideoThumbnails.getThumbnailAsync(playableUri, { time: 0 });
        if (!cancelled) setThumbUri(result.uri);
      } catch {
        // Keep the placeholder — some assets (e.g. iCloud-only originals) can fail to resolve.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [asset]);

  if (!thumbUri) return <View style={[StyleSheet.absoluteFill, styles.thumbPlaceholder]} />;
  return <Image source={{ uri: thumbUri }} style={StyleSheet.absoluteFill} contentFit="cover" />;
}

export default function VideoPickScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const setField = useCreatePostDraftStore((s) => s.setField);
  const [assets, setAssets] = useState<LegacyAsset[]>([]);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const cellSize = (width - GAP * (COLUMNS - 1)) / COLUMNS;

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        setPermissionDenied(true);
        return;
      }
      const page = await MediaLibrary.getAssetsAsync({
        mediaType: ['video'],
        first: 60,
        sortBy: ['creationTime'],
      });
      setAssets(page.assets);
    })();
  }, []);

  const selectAsset = async (asset: LegacyAsset) => {
    const mediaUri = await resolvePlayableUri(asset);
    setField('mediaUri', mediaUri);
    setField('durationSec', asset.duration);
    setField('trimStartSec', 0);
    setField('trimEndSec', Math.min(asset.duration, 60));
    router.push('/create/video-trim');
  };

  const pickFromSystemLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setPermissionDenied(true);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
      quality: 1,
    });
    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    const durationSec = (asset.duration ?? 0) / 1000;
    setField('mediaUri', asset.uri);
    setField('durationSec', durationSec);
    setField('trimStartSec', 0);
    setField('trimEndSec', Math.min(durationSec, 60));
    router.push('/create/video-trim');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={26} color={colors.textPrimary} />
        </Pressable>
        <Pressable onPress={pickFromSystemLibrary} style={styles.photosButton} hitSlop={8}>
          <Ionicons name="images-outline" size={16} color={colors.textPrimary} />
          <Text style={styles.photosButtonText}>Photos</Text>
        </Pressable>
      </View>
      <Text style={[typography.display, styles.title]}>Videos</Text>

      {permissionDenied ? (
        <Text style={[typography.body, styles.muted, styles.emptyState]}>
          Enable photo library access in Settings to select a video.
        </Text>
      ) : (
        <FlatList
          data={assets}
          numColumns={COLUMNS}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={{ gap: GAP }}
          contentContainerStyle={{ gap: GAP }}
          renderItem={({ item }) => (
            <Pressable onPress={() => selectAsset(item)} style={{ width: cellSize, height: cellSize }}>
              <VideoThumb asset={item} />
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{formatDuration(item.duration)}</Text>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={[typography.body, styles.muted, styles.emptyState]}>No videos found on this device.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  photosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: colors.surfaceAlt,
  },
  photosButtonText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  title: {
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  muted: {
    color: colors.textTertiary,
  },
  emptyState: {
    marginTop: spacing.xxxl,
    textAlign: 'center',
  },
  durationBadge: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  durationText: {
    color: colors.textPrimary,
    fontSize: 10,
    fontWeight: '600',
  },
  thumbPlaceholder: {
    backgroundColor: colors.surfaceAlt,
  },
});
