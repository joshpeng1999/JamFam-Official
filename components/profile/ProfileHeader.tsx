import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import type { User } from '../../src/data/types';
import { colors, spacing, typography } from '../../src/theme';
import { Avatar } from '../ui/Avatar';
import { PrimaryButton } from '../ui/PrimaryButton';

interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
  isConnected?: boolean;
  onPrimaryAction: () => void;
}

export function ProfileHeader({ user, isOwnProfile, isConnected, onPrimaryAction }: ProfileHeaderProps) {
  return (
    <View>
      <LinearGradient colors={['#2B1B12', colors.background]} style={styles.cover} />
      <View style={styles.body}>
        <View style={styles.topRow}>
          <Avatar name={user.name} color={user.avatarColor} size={72} />
          <PrimaryButton
            label={isOwnProfile ? 'Edit Profile' : isConnected ? 'Connected' : 'Connect'}
            variant={isOwnProfile || isConnected ? 'outline' : 'inverted'}
            onPress={onPrimaryAction}
            style={styles.actionButton}
          />
        </View>
        <Text style={[typography.display, styles.name]}>{user.name}</Text>
        <Text style={[typography.body, styles.tagline]}>{user.tagline}</Text>
        <Text style={[typography.body, styles.bio]}>
          {user.roles.join(', ')}. {user.bio}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    height: 96,
  },
  body: {
    paddingHorizontal: spacing.lg,
    marginTop: -36,
    gap: spacing.xs,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  actionButton: {
    paddingHorizontal: spacing.xl,
  },
  name: {
    color: colors.textPrimary,
  },
  tagline: {
    color: colors.textSecondary,
  },
  bio: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
