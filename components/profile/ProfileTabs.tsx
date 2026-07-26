import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../../src/theme';

export type ProfileTab = 'posts' | 'projects' | 'about';

const TABS: { key: ProfileTab; label: string }[] = [
  { key: 'posts', label: 'All Posts' },
  { key: 'projects', label: 'Projects' },
  { key: 'about', label: 'About' },
];

interface ProfileTabsProps {
  active: ProfileTab;
  onChange: (tab: ProfileTab) => void;
}

export function ProfileTabs({ active, onChange }: ProfileTabsProps) {
  return (
    <View style={styles.row}>
      {TABS.map((tab) => (
        <Pressable key={tab.key} onPress={() => onChange(tab.key)} style={styles.tab}>
          <Text style={[typography.subtitle, active === tab.key ? styles.active : styles.inactive]}>
            {tab.label}
          </Text>
          {active === tab.key && <View style={styles.underline} />}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.xl,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  tab: {
    paddingBottom: spacing.sm,
  },
  active: {
    color: colors.textPrimary,
  },
  inactive: {
    color: colors.textTertiary,
  },
  underline: {
    height: 2,
    backgroundColor: colors.textPrimary,
    marginTop: spacing.sm,
  },
});
