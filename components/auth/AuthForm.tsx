import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Logo from '../../assets/logo.svg';
import { describeAuthError } from '../../src/store/useAuthStore';
import { colors, spacing, typography } from '../../src/theme';
import { PrimaryButton } from '../ui/PrimaryButton';
import { TextField } from '../ui/TextField';

interface AuthFormProps {
  title: string;
  subtitle: string;
  submitLabel: string;
  onSubmit: (email: string, password: string) => Promise<void>;
  footer: ReactNode;
  extra?: (email: string, setError: (message: string | null) => void) => ReactNode;
}

// Shared layout for the sign-in and sign-up screens.
export function AuthForm({ title, subtitle, submitLabel, onSubmit, footer, extra }: AuthFormProps) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.trim().length > 0 && password.length > 0;

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(email, password);
      // The splash route decides where to go next (profile setup or feed).
      router.replace('/');
    } catch (e) {
      setError(describeAuthError(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.xxxl }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logo}>
          <Logo width={64} height={62} />
        </View>
        <Text style={[typography.display, styles.light]}>{title}</Text>
        <Text style={[typography.body, styles.muted]}>{subtitle}</Text>

        <View style={styles.fields}>
          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            textContentType="emailAddress"
          />
          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="At least 6 characters"
            secureTextEntry
            autoCapitalize="none"
            textContentType="password"
            onSubmitEditing={submit}
          />
          {!!error && <Text style={[typography.body, styles.error]}>{error}</Text>}
        </View>

        <PrimaryButton label={submitLabel} onPress={submit} disabled={!canSubmit} loading={submitting} />
        {extra?.(email, setError)}
        <View style={styles.footer}>{footer}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
  logo: {
    marginBottom: spacing.lg,
  },
  fields: {
    gap: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  light: {
    color: colors.textPrimary,
  },
  muted: {
    color: colors.textSecondary,
  },
  error: {
    color: colors.danger,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
});
