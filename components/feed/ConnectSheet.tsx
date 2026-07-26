import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { forwardRef, useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Post, User } from '../../src/data/types';
import { colors, radii, spacing, typography } from '../../src/theme';
import { formatDuration } from '../../src/utils/format';
import { Avatar } from '../ui/Avatar';
import { PrimaryButton } from '../ui/PrimaryButton';

interface ConnectSheetProps {
  post: Post | null;
  author: User | null;
  onSend: (message: string | undefined) => void;
}

export const ConnectSheet = forwardRef<BottomSheetModal, ConnectSheetProps>(
  ({ post, author, onSend }, ref) => {
    const [message, setMessage] = useState('');
    const snapPoints = useMemo(() => ['55%'], []);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.6} />
      ),
      [],
    );

    if (!post || !author) return null;

    const send = (withMessage: boolean) => {
      onSend(withMessage && message.trim() ? message.trim() : undefined);
      setMessage('');
    };

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
        enableDynamicSizing={false}
      >
        <BottomSheetView style={styles.container}>
          <View style={styles.header}>
            <Avatar name={author.name} color={author.avatarColor} size={56} />
            <Text style={[typography.title, styles.headerTitle]}>Collaborate with {author.name}</Text>
          </View>

          <View style={styles.postPreview}>
            <View style={styles.postThumb} />
            <View style={{ flex: 1 }}>
              <Text style={[typography.bodyStrong, styles.dark]}>{post.title}</Text>
              <Text style={[typography.caption, styles.muted]}>
                {post.type[0].toUpperCase() + post.type.slice(1)}
                {post.durationSec ? ` · ${formatDuration(post.durationSec)}` : ''}
              </Text>
            </View>
          </View>

          <Text style={[typography.bodyStrong, styles.dark, styles.label]}>Message (Optional)</Text>
          <BottomSheetTextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Ex: Hey, I was wanting to collaborate with you on this track…"
            placeholderTextColor={colors.sheetTextTertiary}
            multiline
            style={styles.input}
          />

          <PrimaryButton label="Send Connection Request" onPress={() => send(true)} style={styles.sendButton} />
          <Pressable onPress={() => send(false)} style={styles.skipButton}>
            <Text style={[typography.body, styles.muted]}>Send without Personalized Note</Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

ConnectSheet.displayName = 'ConnectSheet';

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: colors.sheetBackground,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
  },
  handleIndicator: {
    backgroundColor: colors.sheetTextTertiary,
    width: 40,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
  header: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerTitle: {
    color: colors.sheetTextPrimary,
    textAlign: 'center',
  },
  postPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.sheetSurfaceAlt,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.sheetBorder,
    padding: spacing.md,
  },
  postThumb: {
    width: 44,
    height: 44,
    borderRadius: radii.sm,
    backgroundColor: colors.border,
  },
  dark: {
    color: colors.sheetTextPrimary,
  },
  muted: {
    color: colors.sheetTextSecondary,
  },
  label: {
    marginTop: spacing.xs,
  },
  input: {
    backgroundColor: colors.sheetSurfaceAlt,
    borderRadius: radii.md,
    padding: spacing.md,
    minHeight: 90,
    textAlignVertical: 'top',
    color: colors.sheetTextPrimary,
    fontSize: 14,
  },
  sendButton: {
    marginTop: spacing.sm,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
});
