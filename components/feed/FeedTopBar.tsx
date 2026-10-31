import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing, typography } from '../../src/theme';

export type FeedTab = 'explore' | 'friends';

interface FeedTopBarProps {
  tab: FeedTab;
  onChangeTab: (tab: FeedTab) => void;
}

export function FeedTopBar({ tab, onChangeTab }: FeedTopBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { top: insets.top + spacing.sm }]} pointerEvents="box-none">
      <Pressable style={styles.locationPill}>
        <Ionicons name="location-outline" size={13} color={colors.textPrimary} />
        <Text style={[typography.micro, styles.locationText]}>Remote</Text>
      </Pressable>

      <View style={styles.tabs}>
        <Pressable onPress={() => onChangeTab('explore')}>
          <Text style={[typography.subtitle, tab === 'explore' ? styles.tabActive : styles.tabInactive]}>
            Explore
          </Text>
        </Pressable>
        <Pressable onPress={() => onChangeTab('friends')}>
          <Text style={[typography.subtitle, tab === 'friends' ? styles.tabActive : styles.tabInactive]}>
            JamFam
          </Text>
        </Pressable>
      </View>

      <Pressable hitSlop={8}>
        <Ionicons name="search" size={20} color={colors.textPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  locationText: {
    color: colors.textPrimary,
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  tabActive: {
    color: colors.textPrimary,
  },
  tabInactive: {
    color: colors.textTertiary,
  },
});
