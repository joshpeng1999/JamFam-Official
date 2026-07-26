import { StyleSheet, Text, View } from 'react-native';

import type { Prompt } from '../../src/data/types';
import { colors, radii, spacing, typography } from '../../src/theme';

export function PromptCard({ question, answer }: Prompt) {
  return (
    <View style={styles.card}>
      <Text style={[typography.caption, styles.question]}>{question}</Text>
      <Text style={[typography.bodyStrong, styles.answer]}>{answer}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  question: {
    color: colors.textTertiary,
  },
  answer: {
    color: colors.textPrimary,
  },
});
