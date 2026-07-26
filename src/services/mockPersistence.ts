import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_PREFIX = '@jamfam/';

// Backing store for the zustand mock data layer. Swapping any of the
// zustand stores in `src/store` to call Firestore instead of these two
// functions is the entire migration path to a real backend.
export async function loadCollection<T>(key: string, fallback: T[]): Promise<T[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T[];
  } catch {
    return fallback;
  }
}

export async function saveCollection<T>(key: string, items: T[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(items));
}
