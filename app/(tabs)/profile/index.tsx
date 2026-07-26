import { Alert } from 'react-native';

import { ProfileScreenBody } from '../../../components/profile/ProfileScreenBody';
import { CURRENT_USER_ID } from '../../../src/data/types';
import { useUsersStore } from '../../../src/store/useUsersStore';

export default function OwnProfileScreen() {
  const user = useUsersStore((s) => s.getUser(CURRENT_USER_ID));
  if (!user) return null;

  return (
    <ProfileScreenBody
      user={user}
      isOwnProfile
      onPrimaryAction={() => Alert.alert('Edit Profile', 'Profile editing isn’t available in this preview yet.')}
    />
  );
}
