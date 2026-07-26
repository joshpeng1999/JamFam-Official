import { useMemo, useRef, useState } from 'react';
import { PanResponder, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '../../src/theme';
import { formatDuration } from '../../src/utils/format';

interface TrimSelectorProps {
  durationSec: number;
  maxWindowSec: number;
  startSec: number;
  endSec: number;
  onChange: (startSec: number, endSec: number) => void;
}

const HANDLE_SIZE = 24;
const MIN_WINDOW_SEC = 1;

export function TrimSelector({ durationSec, maxWindowSec, startSec, endSec, onChange }: TrimSelectorProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const startRef = useRef(startSec);
  const endRef = useRef(endSec);
  startRef.current = startSec;
  endRef.current = endSec;

  const safeDuration = durationSec > 0 ? durationSec : 1;
  const pxPerSec = trackWidth / safeDuration;

  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

  const startPanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gesture) => {
          if (pxPerSec <= 0) return;
          const deltaSec = gesture.dx / pxPerSec;
          const lowerBound = Math.max(0, endRef.current - maxWindowSec);
          const upperBound = endRef.current - MIN_WINDOW_SEC;
          const next = clamp(startRef.current + deltaSec, lowerBound, Math.max(lowerBound, upperBound));
          onChange(next, endRef.current);
        },
      }),
    [pxPerSec, maxWindowSec, onChange],
  );

  const endPanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gesture) => {
          if (pxPerSec <= 0) return;
          const deltaSec = gesture.dx / pxPerSec;
          const upperBound = Math.min(safeDuration, startRef.current + maxWindowSec);
          const minEnd = startRef.current + MIN_WINDOW_SEC;
          const next = clamp(endRef.current + deltaSec, minEnd, upperBound);
          onChange(startRef.current, next);
        },
      }),
    [pxPerSec, maxWindowSec, safeDuration, onChange],
  );

  const startX = startSec * pxPerSec;
  const endX = endSec * pxPerSec;

  return (
    <View>
      <View style={styles.track} onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}>
        <View style={[styles.selectedWindow, { left: startX, width: Math.max(endX - startX, 0) }]} />
        {trackWidth > 0 && (
          <>
            <View
              {...startPanResponder.panHandlers}
              style={[styles.handle, { left: clamp(startX - HANDLE_SIZE / 2, -HANDLE_SIZE / 2, trackWidth) }]}
            />
            <View
              {...endPanResponder.panHandlers}
              style={[styles.handle, { left: clamp(endX - HANDLE_SIZE / 2, 0, trackWidth) }]}
            />
          </>
        )}
      </View>
      <View style={styles.labels}>
        <Text style={[typography.caption, styles.labelText]}>{formatDuration(startSec)}</Text>
        <Text style={[typography.caption, styles.labelText]}>
          {formatDuration(Math.max(endSec - startSec, 0))} selected
        </Text>
        <Text style={[typography.caption, styles.labelText]}>{formatDuration(endSec)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceAlt,
    justifyContent: 'center',
  },
  selectedWindow: {
    position: 'absolute',
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.accent,
  },
  handle: {
    position: 'absolute',
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    borderRadius: HANDLE_SIZE / 2,
    backgroundColor: colors.textPrimary,
    borderWidth: 3,
    borderColor: colors.accent,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  labelText: {
    color: colors.textSecondary,
  },
});
