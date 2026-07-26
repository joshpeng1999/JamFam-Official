import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '../../src/theme';

interface PillProps {
  label: string;
  tone?: 'blue' | 'green';
}

export function Pill({ label, tone = 'blue' }: PillProps) {
  const isBlue = tone === 'blue';
  return (
    <View
      style={[
        styles.pill,
        { backgroundColor: isBlue ? colors.pillBlueBg : colors.pillGreenBg },
      ]}
    >
      <Text style={[typography.caption, { color: isBlue ? colors.pillBlue : colors.pillGreen }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    alignSelf: 'flex-start',
  },
});
