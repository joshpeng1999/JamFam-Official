import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '../../components/ui/Avatar';
import { useCurrentUserId } from '../../src/store/useAuthStore';
import { otherParticipant, useConversationsStore } from '../../src/store/useConversationsStore';
import { useUsersStore } from '../../src/store/useUsersStore';
import { colors, spacing, typography } from '../../src/theme';
import { timeAgo } from '../../src/utils/format';

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const currentUserId = useCurrentUserId();
  const conversations = useConversationsStore((s) => s.conversations);
  const getUser = useUsersStore((s) => s.getUser);

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      <Text style={[typography.display, styles.heading]}>Messages</Text>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const otherId = otherParticipant(item, currentUserId);
          const user = otherId ? getUser(otherId) : undefined;
          if (!user) return null;
          return (
            <Pressable style={styles.row} onPress={() => router.push(`/profile/user/${user.id}`)}>
              <Avatar name={user.name} color={user.avatarColor} size={48} />
              <View style={{ flex: 1 }}>
                <Text style={[typography.bodyStrong, styles.heading]}>{user.name}</Text>
                <Text style={[typography.body, styles.muted]} numberOfLines={1}>
                  {item.lastMessage}
                </Text>
              </View>
              <Text style={[typography.micro, styles.muted]}>{timeAgo(item.lastMessageAt)}</Text>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <Text style={[typography.body, styles.muted, styles.empty]}>
            No conversations yet — accept a connection request to start one.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  heading: {
    color: colors.textPrimary,
  },
  muted: {
    color: colors.textTertiary,
  },
  listContent: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  empty: {
    textAlign: 'center',
    marginTop: spacing.xxxl,
  },
});
