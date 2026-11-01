import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import { Avatar } from '../components/ui/Avatar';
import { useCurrentUserId } from '../src/store/useAuthStore';
import { useUsersStore } from '../src/store/useUsersStore';
import { colors, radii, spacing, typography } from '../src/theme';

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const currentUserId = useCurrentUserId();
  const [searchText, setSearchText] = useState('');
  const results = useUsersStore(useShallow((s) => s.searchUsers(searchText, currentUserId)));
  const hasQuery = searchText.trim().length > 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={16} color={colors.textTertiary} />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search artists by name"
            placeholderTextColor={colors.textTertiary}
            autoFocus
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            style={styles.input}
          />
          {searchText.length > 0 && (
            <Pressable onPress={() => setSearchText('')} hitSlop={12}>
              <Ionicons name="close-circle" size={16} color={colors.textTertiary} />
            </Pressable>
          )}
        </View>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <Pressable style={styles.row} onPress={() => router.push(`/user/${item.id}`)}>
            <Avatar name={item.name} color={item.avatarColor} size={44} />
            <View style={{ flex: 1 }}>
              <Text style={[typography.bodyStrong, styles.name]} numberOfLines={1}>
                {item.name}
              </Text>
              {item.roles.length > 0 && (
                <Text style={[typography.caption, styles.muted]} numberOfLines={1}>
                  {item.roles.slice(0, 2).join(' · ')}
                </Text>
              )}
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={[typography.body, styles.muted, styles.empty]}>
            {hasQuery ? `No artists found for “${searchText.trim()}”.` : 'Start typing a name to find artists.'}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
  },
  input: {
    ...typography.body,
    flex: 1,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  name: {
    color: colors.textPrimary,
  },
  muted: {
    color: colors.textTertiary,
  },
  empty: {
    textAlign: 'center',
    marginTop: spacing.xxxl,
  },
});
