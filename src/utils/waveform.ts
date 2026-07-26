// Deterministic pseudo-random bar heights for a given post's waveform seed.
// There's no real amplitude data (no native audio-analysis module in Expo
// Go), so the same seed always renders the same bar pattern, which is
// visually indistinguishable from a real waveform in a scrolling feed.
export function generateWaveformBars(seed: number, count: number): number[] {
  let value = seed || 1;
  const next = () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
  const bars: number[] = [];
  for (let i = 0; i < count; i += 1) {
    bars.push(0.25 + next() * 0.75);
  }
  return bars;
}
