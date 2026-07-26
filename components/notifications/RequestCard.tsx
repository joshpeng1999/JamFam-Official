import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { ConnectionRequest, Post, User } from '../../src/data/types';
import { colors, radii, spacing, typography } from '../../src/theme';
import { formatDuration } from '../../src/utils/format';
import { Avatar } from '../ui/Avatar';
import { PrimaryButton } from '../ui/PrimaryButton';

interface RequestCardProps {
  request: ConnectionRequest;
  requester: User;
  post?: Post;
  onAccept: () => void;
  onDecline: () => void;
  onReply: () => void;
  onPressAvatar: () => void;
}

export function RequestCard({ request, requester, post, onAccept, onDecline, onReply, onPressAvatar }: RequestCardProps) {
  return (
    <View style={styles.card}>
      <Pressable style={styles.header} onPress={onPressAvatar}>
        <Avatar name={requester.name} color={requester.avatarColor} size={44} />
        <View style={{ flex: 1 }}>
          <Text style={typography.body}>
            <Text style={styles.bold}>{requester.name}</Text>
            <Text style={styles.text}> wants to connect with you.</Text>
          </Text>
          <Text style={[typography.caption, styles.muted]}>{requester.roles.slice(0, 2).join(' · ')}</Text>
        </View>
      </Pressable>

      {post && (
        <View style={styles.postCard}>
          <View style={styles.postThumb} />
          <View>
            <Text style={[typography.bodyStrong, styles.text]}>{post.title}</Text>
            <Text style={[typography.caption, styles.muted]}>
              {post.type[0].toUpperCase() + post.type.slice(1)}
              {post.durationSec ? ` · ${formatDuration(post.durationSec)}` : ''}
            </Text>
          </View>
        </View>
      )}

      {request.message && (
        <View>
          <Text style={[typography.body, styles.text]}>{request.message}</Text>
          <Pressable onPress={onReply}>
            <Text style={[typography.bodyStrong, styles.replyLink]}>Reply</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.actions}>
        <PrimaryButton label="Accept" variant="inverted" onPress={onAccept} style={styles.actionButton} />
        <PrimaryButton label="Decline" variant="outline" onPress={onDecline} style={styles.actionButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
    paddingVertical: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  text: {
    color: colors.textPrimary,
  },
  bold: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  muted: {
    color: colors.textTertiary,
  },
  postCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  postThumb: {
    width: 44,
    height: 44,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceAlt,
  },
  replyLink: {
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});
