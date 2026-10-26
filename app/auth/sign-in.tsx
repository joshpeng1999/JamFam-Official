import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';

import { AuthForm } from '../../components/auth/AuthForm';
import { describeAuthError, useAuthStore } from '../../src/store/useAuthStore';
import { colors, typography } from '../../src/theme';

export default function SignInScreen() {
  const signIn = useAuthStore((s) => s.signIn);
  const resetPassword = useAuthStore((s) => s.resetPassword);

  return (
    <AuthForm
      title="Welcome back"
      subtitle="Sign in to keep jamming."
      submitLabel="Sign In"
      onSubmit={signIn}
      extra={(email, setError) => (
        <Pressable
          style={styles.center}
          onPress={async () => {
            if (!email.trim()) {
              setError('Enter your email above, then tap “Forgot password?” again.');
              return;
            }
            try {
              await resetPassword(email);
              Alert.alert('Check your email', `We sent a password reset link to ${email.trim()}.`);
            } catch (e) {
              setError(describeAuthError(e));
            }
          }}
        >
          <Text style={[typography.body, styles.muted]}>Forgot password?</Text>
        </Pressable>
      )}
      footer={
        <>
          <Text style={[typography.body, styles.muted]}>New to Jamfam? </Text>
          <Pressable onPress={() => router.replace('/auth/sign-up')}>
            <Text style={[typography.bodyStrong, styles.link]}>Create an account</Text>
          </Pressable>
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
  },
  muted: {
    color: colors.textSecondary,
  },
  link: {
    color: colors.accent,
  },
});
