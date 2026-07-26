import type { TextStyle } from 'react-native';

export const typography = {
  display: { fontSize: 26, fontWeight: '700', letterSpacing: -0.3 } satisfies TextStyle,
  title: { fontSize: 20, fontWeight: '700' } satisfies TextStyle,
  subtitle: { fontSize: 16, fontWeight: '600' } satisfies TextStyle,
  body: { fontSize: 14, fontWeight: '400' } satisfies TextStyle,
  bodyStrong: { fontSize: 14, fontWeight: '600' } satisfies TextStyle,
  caption: { fontSize: 12, fontWeight: '500' } satisfies TextStyle,
  micro: { fontSize: 11, fontWeight: '500' } satisfies TextStyle,
} as const;
