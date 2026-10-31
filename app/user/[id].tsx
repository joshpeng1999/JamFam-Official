import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { useRef } from 'react';
import { Alert } from 'react-native';

import { ConnectSheet } from '../../components/feed/ConnectSheet';
import { ProfileScreenBody } from '../../components/profile/ProfileScreenBody';
import { useCurrentUserId } from '../../src/store/useAuthStore';
import { useConnectionsStore } from '../../src/store/useConnectionsStore';
import { usePostsStore } from '../../src/store/usePostsStore';
import { useUsersStore } from '../../src/store/useUsersStore';

export default function OtherUserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const currentUserId = useCurrentUserId();
  const user = useUsersStore((s) => s.getUser(id));
  const getPostsByAuthor = usePostsStore((s) => s.getPostsByAuthor);
  const sendConnectionRequest = useConnectionsStore((s) => s.sendConnectionRequest);
  const isConnected = useConnectionsStore((s) => s.getAcceptedConnectionIds(currentUserId).includes(id));
  const sheetRef = useRef<BottomSheetModal>(null);

  if (!user) return null;

  if (user.id === currentUserId) return <Redirect href="/profile" />;

  const latestPost = getPostsByAuthor(user.id)[0];

  return (
    <>
      <ProfileScreenBody
        user={user}
        isOwnProfile={false}
        isConnected={isConnected}
        onPrimaryAction={() => {
          if (isConnected) return;
          if (!latestPost) {
            Alert.alert('No posts yet', `${user.name} hasn't shared any work to connect over yet.`);
            return;
          }
          sheetRef.current?.present();
        }}
      />
      <ConnectSheet
        ref={sheetRef}
        post={latestPost ?? null}
        author={user}
        onSend={(message) => {
          if (!latestPost) return;
          sendConnectionRequest({
            fromUserId: currentUserId,
            toUserId: user.id,
            postId: latestPost.id,
            message,
          }).catch(() => Alert.alert('Couldn’t send request', 'Check your connection and try again.'));
          sheetRef.current?.dismiss();
        }}
      />
    </>
  );
}
