import { router } from 'expo-router';

import { ProfileScreenBody } from '../../components/profile/ProfileScreenBody';
import { useCurrentUserId } from '../../src/store/useAuthStore';
import { useUsersStore } from '../../src/store/useUsersStore';

export default function OwnProfileScreen() {
  const currentUserId = useCurrentUserId();
  const user = useUsersStore((s) => s.getUser(currentUserId));
  if (!user) return null;

  return (
    <ProfileScreenBody
      user={user}
      isOwnProfile
      onPrimaryAction={() => router.push('/profile-setup')}
    />
  );
}
