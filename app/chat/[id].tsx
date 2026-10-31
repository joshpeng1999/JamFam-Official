import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MessageBubble } from '../../components/chat/MessageBubble';
import { Avatar } from '../../components/ui/Avatar';
import { MAX_MESSAGE_LENGTH, type Message } from '../../src/data/types';
import { useCurrentUserId } from '../../src/store/useAuthStore';
import { useConnectionsStore } from '../../src/store/useConnectionsStore';
import { conversationIdFor, useConversationsStore } from '../../src/store/useConversationsStore';
import { useUsersStore } from '../../src/store/useUsersStore';
import { colors, radii, spacing, typography } from '../../src/theme';

// `id` is the other person's user id.
export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const currentUserId = useCurrentUserId();
  const user = useUsersStore((s) => s.getUser(id));
  const requests = useConnectionsStore((s) => s.requests);
  const subscribeToMessages = useConversationsStore((s) => s.subscribeToMessages);
  const sendMessage = useConversationsStore((s) => s.sendMessage);

  const [messages, setMessages] = useState<Message[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [draft, setDraft] = useState('');

  const conversationId = conversationIdFor(currentUserId, id);
  const canMessage = useConversationsStore((s) => s.conversations.some((c) => c.id === conversationId));

  useEffect(() => {
    const subscription = subscribeToMessages(conversationId, setMessages);
    subscription.firstLoad.then(() => setLoaded(true));
    return subscription.unsubscribe;
  }, [conversationId, subscribeToMessages]);

  // Newest first for the inverted list. The notes people attached to their
  // connection requests open the chat, so they appear as its earliest messages.
  const thread = useMemo(() => {
    const requestNotes: Message[] = requests
      .filter(
        (r) =>
          r.message &&
          r.status !== 'declined' &&
          conversationIdFor(r.fromUserId, r.toUserId) === conversationId,
      )
      .map((r) => ({ id: r.id, senderId: r.fromUserId, text: r.message!, createdAt: r.createdAt }));
    return [...messages, ...requestNotes].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [messages, requests, conversationId]);

  if (!user) return null;

  const trimmedDraft = draft.trim();

  const send = () => {
    if (!trimmedDraft) return;
    setDraft('');
    sendMessage(currentUserId, user.id, trimmedDraft).catch(() => {
      setDraft(trimmedDraft);
      Alert.alert('Couldn’t send message', 'Check your connection and try again.');
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      // The composer already pads for the home indicator, which the keyboard covers.
      keyboardVerticalOffset={-insets.bottom}
    >
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Pressable style={styles.headerUser} onPress={() => router.push(`/user/${user.id}`)}>
          <Avatar name={user.name} color={user.avatarColor} size={36} />
          <Text style={[typography.subtitle, styles.headerName]} numberOfLines={1}>
            {user.name}
          </Text>
        </Pressable>
      </View>

      {loaded && thread.length === 0 ? (
        <View style={styles.empty}>
          <Avatar name={user.name} color={user.avatarColor} size={72} />
          <Text style={[typography.title, styles.headerName]}>{user.name}</Text>
          <Text style={[typography.body, styles.emptyBody]}>
            {canMessage ? 'Say hi and start collaborating.' : `You can message ${user.name} once you’re connected.`}
          </Text>
        </View>
      ) : (
        <FlatList
          style={styles.list}
          data={thread}
          inverted
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          renderItem={({ item, index }) => (
            <MessageBubble
              text={item.text}
              createdAt={item.createdAt}
              isMine={item.senderId === currentUserId}
              otherUser={user}
              isLastInRun={index === 0 || thread[index - 1].senderId !== item.senderId}
            />
          )}
        />
      )}

      {canMessage && (
        <View style={[styles.composer, { paddingBottom: insets.bottom || spacing.md }]}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Message…"
            placeholderTextColor={colors.textTertiary}
            multiline
            maxLength={MAX_MESSAGE_LENGTH}
            style={styles.input}
          />
          <Pressable
            onPress={send}
            disabled={!trimmedDraft}
            hitSlop={8}
            style={[styles.sendButton, !trimmedDraft && styles.sendButtonDisabled]}
          >
            <Ionicons name="arrow-up" size={20} color={colors.background} />
          </Pressable>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  headerUser: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerName: {
    flexShrink: 1,
    color: colors.textPrimary,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xxl,
  },
  emptyBody: {
    color: colors.textTertiary,
    textAlign: 'center',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  input: {
    ...typography.body,
    flex: 1,
    maxHeight: 120,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
});
