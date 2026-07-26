import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radii, spacing, typography } from '../../src/theme';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  variant?: 'dark' | 'light';
}

export function Chip({ label, selected, onPress, variant = 'light' }: ChipProps) {
  const isDark = variant === 'dark';
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: isDark ? colors.surfaceAlt : colors.sheetSurfaceAlt,
          borderColor: selected ? colors.accent : 'transparent',
        },
      ]}
    >
      <Text
        style={[
          typography.body,
          { color: isDark ? colors.textPrimary : colors.sheetTextPrimary },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.pill,
    borderWidth: 1.5,
  },
});
