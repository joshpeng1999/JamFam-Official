import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack } from 'expo-router';

import { colors } from '../../src/theme';

export default function CreateLayout() {
  return (
    // `create` is presented as a native modal from the root Stack, which
    // renders in its own native layer above the base screen. The root
    // BottomSheetModalProvider's portal lives in that base layer, so any
    // sheet opened from inside this modal (e.g. the tag picker) would
    // render behind it and be invisible. A second provider scoped to this
    // stack gives sheets opened in here a portal inside the modal's own
    // layer instead.
    <BottomSheetModalProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_bottom',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="video-pick" />
        <Stack.Screen name="video-trim" />
        <Stack.Screen name="audio-pick" />
        <Stack.Screen name="audio-trim" />
        <Stack.Screen name="lyrics" />
        <Stack.Screen name="details" />
      </Stack>
    </BottomSheetModalProvider>
  );
}
