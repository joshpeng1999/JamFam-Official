import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import type { User } from '../../src/data/types';
import { colors, radii, spacing, typography } from '../../src/theme';
import { PromptCard } from './PromptCard';

interface AboutSectionProps {
  user: User;
}

function ChipRow({ items }: { items: string[] }) {
  return (
    <View style={styles.chipRow}>
      {items.map((item) => (
        <View key={item} style={styles.chip}>
          <Text style={[typography.caption, styles.chipText]}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function SectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={[typography.subtitle, styles.light]}>{label}</Text>
      <Text style={[typography.caption, styles.muted]}>Show all ({count})</Text>
    </View>
  );
}

export function AboutSection({ user }: AboutSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={[typography.subtitle, styles.light]}>The Basics</Text>
      <View style={styles.basicsCard}>
        <View style={styles.basicsRow}>
          <View style={styles.basicPill}>
            <Ionicons name="location-outline" size={14} color={colors.textPrimary} />
            <Text style={[typography.caption, styles.light]}>{user.location}</Text>
          </View>
          {user.pronouns && (
            <View style={styles.basicPill}>
              <Ionicons name="person-outline" size={14} color={colors.textPrimary} />
              <Text style={[typography.caption, styles.light]}>{user.pronouns}</Text>
            </View>
          )}
          {user.age && (
            <View style={styles.basicPill}>
              <Ionicons name="briefcase-outline" size={14} color={colors.textPrimary} />
              <Text style={[typography.caption, styles.light]}>{user.age}</Text>
            </View>
          )}
        </View>

        <View style={styles.divider} />
        <ChipRow items={user.roles} />

        {(user.socialLinks.length > 0 || user.portfolioUrl) && <View style={styles.divider} />}
        {user.socialLinks.map((link) => (
          <View key={link.url} style={styles.linkRow}>
            <Ionicons name="link" size={14} color={colors.textSecondary} />
            <Text style={[typography.body, styles.muted]}>{link.label}</Text>
          </View>
        ))}
        {user.portfolioUrl && (
          <View style={styles.linkRow}>
            <Ionicons name="link" size={14} color={colors.textSecondary} />
            <Text style={[typography.body, styles.muted]}>{user.portfolioUrl}</Text>
          </View>
        )}
      </View>

      {user.musicalInfluences.length > 0 && (
        <View style={styles.section}>
          <SectionHeader label="Musical Influences" count={user.musicalInfluences.length} />
          <ChipRow items={user.musicalInfluences} />
        </View>
      )}

      {user.preferredGenres.length > 0 && (
        <View style={styles.section}>
          <SectionHeader label="Preferred Genres" count={user.preferredGenres.length} />
          <ChipRow items={user.preferredGenres} />
        </View>
      )}

      {user.prompts.length > 0 && (
        <View style={styles.section}>
          <Text style={[typography.subtitle, styles.light]}>Get to Know Me</Text>
          <View style={styles.prompts}>
            {user.prompts.map((prompt) => (
              <PromptCard key={prompt.question} question={prompt.question} answer={prompt.answer} />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
  light: {
    color: colors.textPrimary,
  },
  muted: {
    color: colors.textSecondary,
  },
  basicsCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.md,
  },
  basicsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  basicPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  chipText: {
    color: colors.textPrimary,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  section: {
    gap: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  prompts: {
    gap: spacing.sm,
  },
});
