import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef } from 'react';
import { Alert } from 'react-native';

import { ConnectSheet } from '../../../../components/feed/ConnectSheet';
import { ProfileScreenBody } from '../../../../components/profile/ProfileScreenBody';
import { CURRENT_USER_ID } from '../../../../src/data/types';
import { useConnectionsStore } from '../../../../src/store/useConnectionsStore';
import { usePostsStore } from '../../../../src/store/usePostsStore';
import { useUsersStore } from '../../../../src/store/useUsersStore';

export default function OtherUserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useUsersStore((s) => s.getUser(id));
  const getPostsByAuthor = usePostsStore((s) => s.getPostsByAuthor);
  const sendConnectionRequest = useConnectionsStore((s) => s.sendConnectionRequest);
  const isConnected = useConnectionsStore((s) => s.getAcceptedConnectionIds(CURRENT_USER_ID).includes(id));
  const sheetRef = useRef<BottomSheetModal>(null);

  if (!user) return null;

  if (user.id === CURRENT_USER_ID) {
    router.replace('/profile');
    return null;
  }

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
            fromUserId: CURRENT_USER_ID,
            toUserId: user.id,
            postId: latestPost.id,
            message,
          });
          sheetRef.current?.dismiss();
        }}
      />
    </>
  );
}
