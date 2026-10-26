import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { AuthForm } from '../../components/auth/AuthForm';
import { useAuthStore } from '../../src/store/useAuthStore';
import { colors, typography } from '../../src/theme';

export default function SignUpScreen() {
  const signUp = useAuthStore((s) => s.signUp);

  return (
    <AuthForm
      title="Join Jamfam"
      subtitle="Share works-in-progress and find your collaborators."
      submitLabel="Create Account"
      onSubmit={signUp}
      footer={
        <>
          <Text style={[typography.body, styles.muted]}>Already have an account? </Text>
          <Pressable onPress={() => router.replace('/auth/sign-in')}>
            <Text style={[typography.bodyStrong, styles.link]}>Sign in</Text>
          </Pressable>
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  muted: {
    color: colors.textSecondary,
  },
  link: {
    color: colors.accent,
  },
});
