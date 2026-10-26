import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors, radii, spacing, typography } from '../../src/theme';

interface TextFieldProps extends TextInputProps {
  label: string;
  hint?: string;
}

export function TextField({ label, hint, style, multiline, ...inputProps }: TextFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={[typography.bodyStrong, styles.label]}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.textTertiary}
        multiline={multiline}
        style={[styles.input, multiline && styles.multiline, style]}
        {...inputProps}
      />
      {!!hint && <Text style={[typography.caption, styles.hint]}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs + 2,
  },
  label: {
    color: colors.textPrimary,
  },
  input: {
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  multiline: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  hint: {
    color: colors.textTertiary,
  },
});
