import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { forwardRef, useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { COLLABORATOR_ROLES } from '../../src/data/types';
import { colors, radii, spacing, typography } from '../../src/theme';
import { Chip } from '../ui/Chip';
import { PrimaryButton } from '../ui/PrimaryButton';

interface TagPickerSheetProps {
  selectedTags: string[];
  onSave: (tags: string[]) => void;
}

export const TagPickerSheet = forwardRef<BottomSheetModal, TagPickerSheetProps>(
  ({ selectedTags, onSave }, ref) => {
    const [draft, setDraft] = useState<string[]>(selectedTags);
    const [query, setQuery] = useState('');
    const snapPoints = useMemo(() => ['75%'], []);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.6} />
      ),
      [],
    );

    const roles = COLLABORATOR_ROLES.filter((role) => role.toLowerCase().includes(query.toLowerCase()));

    const toggleRole = (role: string) => {
      setDraft((current) => (current.includes(role) ? current.filter((r) => r !== role) : [...current, role]));
    };

    // BottomSheetScrollView renders its content in an absolutely-positioned
    // node internally (how @gorhom/bottom-sheet wires up pan-to-scroll), so
    // it can't be treated as a normal flex sibling next to a header/footer —
    // it overlays them instead of stacking. Everything, including the save
    // button, lives inside the one scroll view so it stays in normal flow;
    // the library's footerComponent/BottomSheetFooter API is the "correct"
    // way to pin it, but it was silently failing to open the sheet at all
    // here, so trading the sticky-footer polish for reliability.
    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
        enableDynamicSizing={false}
        onChange={(index) => {
          if (index >= 0) setDraft(selectedTags);
        }}
      >
        <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={[typography.title, styles.dark]}>Specify collaborator roles</Text>
            <Text style={[typography.body, styles.muted]}>Find the right talent to bring your vision to life.</Text>

            <View style={styles.searchRow}>
              <Ionicons name="search" size={18} color={colors.sheetTextTertiary} />
              <BottomSheetTextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search roles"
                placeholderTextColor={colors.sheetTextTertiary}
                style={styles.searchInput}
              />
            </View>
          </View>

          <View style={styles.chipGrid}>
            {roles.map((role) => (
              <Chip key={role} label={role} selected={draft.includes(role)} onPress={() => toggleRole(role)} />
            ))}
          </View>

          <PrimaryButton
            label="Save Roles & Continue"
            onPress={() => onSave(draft)}
            style={styles.saveButton}
          />
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  },
);

TagPickerSheet.displayName = 'TagPickerSheet';

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: colors.sheetBackground,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
  },
  handleIndicator: {
    backgroundColor: colors.sheetTextTertiary,
    width: 40,
  },
  header: {
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
  },
  dark: {
    color: colors.sheetTextPrimary,
  },
  muted: {
    color: colors.sheetTextSecondary,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.sheetSurfaceAlt,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    color: colors.sheetTextPrimary,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  saveButton: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
});
