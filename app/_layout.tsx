import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { isFirebaseConfigured } from '../src/services/firebase';
import { stopDataSync } from '../src/store/hydrateAll';
import { useAuthStore } from '../src/store/useAuthStore';
import { colors } from '../src/theme';

export default function RootLayout() {
  const uid = useAuthStore((s) => s.uid);
  const previousUid = useRef<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return useAuthStore.getState().init();
  }, []);

  // When someone signs out from anywhere in the app, drop their data and
  // send them back to sign-in.
  useEffect(() => {
    if (previousUid.current && !uid) {
      stopDataSync();
      if (router.canDismiss()) router.dismissAll();
      router.replace('/auth/sign-in');
    }
    previousUid.current = uid;
  }, [uid]);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="auth" options={{ gestureEnabled: false }} />
            <Stack.Screen name="profile-setup" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="user/[id]" />
            <Stack.Screen name="project/[id]" />
            <Stack.Screen name="chat/[id]" />
            <Stack.Screen name="create" options={{ presentation: 'modal' }} />
          </Stack>
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
