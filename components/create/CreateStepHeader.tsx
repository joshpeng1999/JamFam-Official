import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radii, spacing, typography } from '../../src/theme';

interface CreateStepHeaderProps {
  actionLabel: string;
  onAction: () => void;
  actionDisabled?: boolean;
  actionLoading?: boolean;
  onBack?: () => void;
}

export function CreateStepHeader({ actionLabel, onAction, actionDisabled, actionLoading, onBack }: CreateStepHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <Pressable onPress={onBack ?? (() => router.back())} hitSlop={12}>
        <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
      </Pressable>
      <Pressable
        onPress={onAction}
        disabled={actionDisabled || actionLoading}
        style={[styles.actionButton, (actionDisabled || actionLoading) && styles.actionButtonDisabled]}
      >
        {actionLoading ? (
          <ActivityIndicator color={colors.background} size="small" />
        ) : (
          <Text style={[typography.subtitle, styles.actionText]}>{actionLabel}</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  actionButton: {
    backgroundColor: colors.textPrimary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
  },
  actionButtonDisabled: {
    opacity: 0.4,
  },
  actionText: {
    color: colors.background,
  },
});
