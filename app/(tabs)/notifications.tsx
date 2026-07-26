import { router } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import { RequestCard } from '../../components/notifications/RequestCard';
import { CURRENT_USER_ID } from '../../src/data/types';
import { useConnectionsStore } from '../../src/store/useConnectionsStore';
import { useConversationsStore } from '../../src/store/useConversationsStore';
import { usePostsStore } from '../../src/store/usePostsStore';
import { useUsersStore } from '../../src/store/useUsersStore';
import { colors, spacing, typography } from '../../src/theme';

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const requests = useConnectionsStore(useShallow((s) => s.getIncomingRequests(CURRENT_USER_ID)));
  const respondToRequest = useConnectionsStore((s) => s.respondToRequest);
  const ensureConversation = useConversationsStore((s) => s.ensureConversation);
  const getUser = useUsersStore((s) => s.getUser);
  const getPost = usePostsStore((s) => s.getPost);

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      <Text style={[typography.display, styles.heading]}>Notifications</Text>

      <View style={styles.sectionHeader}>
        <Text style={[typography.subtitle, styles.heading]}>Requests</Text>
        <Text style={[typography.body, styles.muted]}>Show all ({requests.length})</Text>
      </View>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const requester = getUser(item.fromUserId);
          if (!requester) return null;
          return (
            <RequestCard
              request={item}
              requester={requester}
              post={getPost(item.postId)}
              onAccept={() => respondToRequest(item.id, 'accepted')}
              onDecline={() => respondToRequest(item.id, 'declined')}
              onReply={() => {
                ensureConversation(item.fromUserId, item.message);
                router.push('/messages');
              }}
              onPressAvatar={() => router.push(`/profile/user/${item.fromUserId}`)}
            />
          );
        }}
        ListEmptyComponent={
          <Text style={[typography.body, styles.muted, styles.empty]}>No pending requests right now.</Text>
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  listContent: {
    paddingBottom: spacing.xxxl,
  },
  empty: {
    textAlign: 'center',
    marginTop: spacing.xxxl,
  },
});
