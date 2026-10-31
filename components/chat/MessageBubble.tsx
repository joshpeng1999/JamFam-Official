import { StyleSheet, Text, View } from 'react-native';

import type { User } from '../../src/data/types';
import { colors, radii, spacing, typography } from '../../src/theme';
import { timeAgo } from '../../src/utils/format';
import { Avatar } from '../ui/Avatar';

interface MessageBubbleProps {
  text: string;
  createdAt: string;
  isMine: boolean;
  otherUser: User;
  // Last message in a run from the same sender: shows the avatar and time.
  isLastInRun: boolean;
}

const AVATAR_SIZE = 28;

export function MessageBubble({ text, createdAt, isMine, otherUser, isLastInRun }: MessageBubbleProps) {
  return (
    <View style={[styles.wrapper, isLastInRun && styles.lastInRun]}>
      <View style={[styles.row, isMine && styles.rowMine]}>
        {!isMine && (
          <View style={styles.avatarSlot}>
            {isLastInRun && <Avatar name={otherUser.name} color={otherUser.avatarColor} size={AVATAR_SIZE} />}
          </View>
        )}
        <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleTheirs]}>
          <Text style={[typography.body, isMine ? styles.textMine : styles.textTheirs]}>{text}</Text>
        </View>
      </View>
      {isLastInRun && (
        <Text style={[typography.micro, styles.time, isMine ? styles.timeMine : styles.timeTheirs]}>
          {timeAgo(createdAt)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 2,
  },
  lastInRun: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  rowMine: {
    justifyContent: 'flex-end',
  },
  avatarSlot: {
    width: AVATAR_SIZE,
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  bubbleMine: {
    backgroundColor: colors.accent,
  },
  bubbleTheirs: {
    backgroundColor: colors.surfaceAlt,
  },
  textMine: {
    color: colors.background,
  },
  textTheirs: {
    color: colors.textPrimary,
  },
  time: {
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  timeMine: {
    textAlign: 'right',
  },
  timeTheirs: {
    marginLeft: AVATAR_SIZE + spacing.sm,
  },
});
