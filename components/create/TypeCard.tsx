import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '../../src/theme';

interface TypeCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  highlight: string;
  onPress: () => void;
}

export function TypeCard({ icon, title, description, highlight, onPress }: TypeCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Ionicons name={icon} size={24} color={colors.sheetTextPrimary} />
      <Text style={[typography.subtitle, styles.title]}>{title}</Text>
      <Text style={[typography.body, styles.description]}>
        {description}
        {'—'}
        <Text style={styles.highlight}>{highlight}</Text>.
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.sheetSurfaceAlt,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  title: {
    color: colors.sheetTextPrimary,
    marginTop: spacing.xs,
  },
  description: {
    color: colors.sheetTextSecondary,
  },
  highlight: {
    color: colors.sheetTextPrimary,
    fontWeight: '700',
  },
});
