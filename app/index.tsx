import * as SplashScreen from 'expo-splash-screen';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import Logo from '../assets/logo.svg';
import { colors } from '../src/theme';
import { hydrateAllStores } from '../src/store/hydrateAll';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function SplashRoute() {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    let cancelled = false;

    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 6, tension: 60, useNativeDriver: true }),
    ]).start();

    (async () => {
      await SplashScreen.hideAsync().catch(() => {});
      await hydrateAllStores();
      await new Promise((resolve) => setTimeout(resolve, 900));
      if (!cancelled) {
        router.replace('/(tabs)');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [opacity, scale]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity, transform: [{ scale }] }}>
        <Logo width={120} height={116} />
      </Animated.View>
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
});
