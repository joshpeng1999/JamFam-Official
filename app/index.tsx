import * as SplashScreen from 'expo-splash-screen';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import Logo from '../assets/logo.svg';
import { isFirebaseConfigured } from '../src/services/firebase';
import { startDataSync } from '../src/store/hydrateAll';
import { useAuthStore } from '../src/store/useAuthStore';
import { useUsersStore } from '../src/store/useUsersStore';
import { colors, spacing, typography } from '../src/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

const MIN_SPLASH_MS = 900;

// Splash + auth gate: waits for Firebase to restore the session, then routes to
// sign-in, first-time profile setup, or the feed.
export default function SplashRoute() {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;
  const initialized = useAuthStore((s) => s.initialized);
  const uid = useAuthStore((s) => s.uid);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 6, tension: 60, useNativeDriver: true }),
    ]).start();
    SplashScreen.hideAsync().catch(() => {});
  }, [opacity, scale]);

  useEffect(() => {
    if (!isFirebaseConfigured || !initialized) return;
    let cancelled = false;
    const minDelay = new Promise((resolve) => setTimeout(resolve, MIN_SPLASH_MS));

    (async () => {
      if (!uid) {
        await minDelay;
        if (!cancelled) router.replace('/auth/sign-in');
        return;
      }
      await Promise.all([startDataSync(uid), minDelay]);
      if (cancelled) return;
      const hasProfile = Boolean(useUsersStore.getState().getUser(uid));
      router.replace(hasProfile ? '/(tabs)' : '/profile-setup');
    })();

    return () => {
      cancelled = true;
    };
  }, [initialized, uid]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity, transform: [{ scale }] }}>
        <Logo width={120} height={116} />
      </Animated.View>
      {!isFirebaseConfigured && (
        <Text style={[typography.body, styles.setup]}>
          Firebase isn’t configured yet.{'\n'}Copy .env.example to .env, fill in your project’s values, then restart
          with `npx expo start --clear`.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setup: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.xxl,
  },
});
