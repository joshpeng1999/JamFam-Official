import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';

import { colors, radii, spacing, typography } from '../../src/theme';

interface PrimaryButtonProps {
  label: string;
  onPress?: () => void;
  variant?: 'accent' | 'inverted' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  style?: ViewStyle;
}

export function PrimaryButton({
  label,
  onPress,
  variant = 'accent',
  disabled,
  loading,
  icon,
  style,
}: PrimaryButtonProps) {
  const backgroundColor =
    variant === 'accent' ? colors.accent : variant === 'inverted' ? colors.textPrimary : 'transparent';
  const textColor = variant === 'inverted' ? colors.background : colors.textPrimary;
  const borderColor = variant === 'outline' ? colors.border : 'transparent';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor, borderColor, borderWidth: variant === 'outline' ? 1.5 : 0 },
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {icon}
          <Text style={[typography.subtitle, { color: textColor }]}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md + 2,
    borderRadius: radii.pill,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
  },
});
