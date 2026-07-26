import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { useCreatePostDraftStore } from '../../src/store/useCreatePostDraftStore';
import { colors, spacing, typography } from '../../src/theme';

export default function AudioPickScreen() {
  const insets = useSafeAreaInsets();
  const setField = useCreatePostDraftStore((s) => s.setField);
  const [picking, setPicking] = useState(false);

  const pickAudio = useCallback(async () => {
    setPicking(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
      if (!result.canceled && result.assets[0]) {
        setField('mediaUri', result.assets[0].uri);
        router.push('/create/audio-trim');
      }
    } finally {
      setPicking(false);
    }
  }, [setField]);

  useEffect(() => {
    pickAudio();
    // Auto-open the file browser on entry, mirroring the tap-through in the design.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      <Pressable onPress={() => router.back()} hitSlop={12}>
        <Ionicons name="close" size={26} color={colors.textPrimary} />
      </Pressable>

      <View style={styles.center}>
        <Ionicons name="musical-notes-outline" size={40} color={colors.textTertiary} />
        <Text style={[typography.subtitle, styles.text]}>Choose an audio file from your device</Text>
        <PrimaryButton label="Browse Files" onPress={pickAudio} loading={picking} style={styles.button} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  text: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  button: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.xxl,
  },
});
