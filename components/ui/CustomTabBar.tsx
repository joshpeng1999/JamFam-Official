import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '../../src/theme';

const ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  index: { active: 'home', inactive: 'home-outline' },
  notifications: { active: 'notifications', inactive: 'notifications-outline' },
  messages: { active: 'chatbubble-ellipses', inactive: 'chatbubble-ellipses-outline' },
  profile: { active: 'person-circle', inactive: 'person-circle-outline' },
};

// Loosely typed to whatever shape expo-router's `Tabs` passes into a custom
// `tabBar` render prop (a thin wrapper around React Navigation's bottom-tabs
// state/navigation objects) — avoids depending on expo-router's internal,
// non-exported `BottomTabBarProps` type.
interface CustomTabBarProps {
  state: {
    index: number;
    routes: { key: string; name: string }[];
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: {
    emit: (event: any) => any;
    navigate: (name: string) => void;
  };
}

export function CustomTabBar({ state, navigation }: CustomTabBarProps) {
  const insets = useSafeAreaInsets();
  const routes = state.routes.filter((r) => ICONS[r.name]);
  const leftRoutes = routes.slice(0, 2);
  const rightRoutes = routes.slice(2);

  const renderIcon = (route: (typeof routes)[number]) => {
    const routeIndex = state.routes.findIndex((r) => r.key === route.key);
    const isFocused = state.index === routeIndex;
    const icon = ICONS[route.name];

    const onPress = () => {
      const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    return (
      <Pressable key={route.key} onPress={onPress} style={styles.iconButton} hitSlop={12}>
        <Ionicons
          name={isFocused ? icon.active : icon.inactive}
          size={26}
          color={isFocused ? colors.textPrimary : colors.textTertiary}
        />
        {isFocused && <View style={styles.dot} />}
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || spacing.md }]}>
      <View style={styles.row}>
        {leftRoutes.map(renderIcon)}
        <Pressable
          onPress={() => router.push('/create')}
          style={styles.createButton}
          hitSlop={12}
        >
          <Ionicons name="add" size={28} color={colors.background} />
        </Pressable>
        {rightRoutes.map(renderIcon)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: spacing.md,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    width: 44,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textPrimary,
  },
  createButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
