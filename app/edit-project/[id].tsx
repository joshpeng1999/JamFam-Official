import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CreateStepHeader } from '../../components/create/CreateStepHeader';
import { Chip } from '../../components/ui/Chip';
import { TextField } from '../../components/ui/TextField';
import type { Project, ProjectStatus } from '../../src/data/types';
import { useCurrentUserId } from '../../src/store/useAuthStore';
import { useProjectsStore } from '../../src/store/useProjectsStore';
import { colors, spacing, typography } from '../../src/theme';

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export default function EditProjectScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const currentUserId = useCurrentUserId();
  const project = useProjectsStore((s) => s.getProject(id));

  // Only the owner can edit; the Firestore rules enforce this too.
  if (!project || project.ownerId !== currentUserId) {
    return (
      <View style={styles.container}>
        <CreateStepHeader actionLabel="Save" actionDisabled onAction={() => {}} />
        <Text style={[typography.body, styles.missing]}>This project can’t be edited.</Text>
      </View>
    );
  }

  return <EditProjectForm project={project} />;
}

function EditProjectForm({ project }: { project: Project }) {
  const updateProject = useProjectsStore((s) => s.updateProject);
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [status, setStatus] = useState<ProjectStatus>(project.status);
  const [saving, setSaving] = useState(false);

  const changed =
    title.trim() !== project.title || description.trim() !== project.description || status !== project.status;
  const canSave = changed && title.trim().length > 0;

  const save = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await updateProject(project.id, { title: title.trim(), description: description.trim(), status });
      router.back();
    } catch (error) {
      console.warn('[edit project] failed:', error);
      Alert.alert('Couldn’t save changes', 'Check your connection and try again.');
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <CreateStepHeader actionLabel="Save" actionDisabled={!canSave} actionLoading={saving} onAction={save} />
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <Text style={[typography.display, styles.heading]}>Edit Project</Text>
        <TextField label="Name" value={title} onChangeText={setTitle} placeholder="Project name" maxLength={80} />
        <TextField
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="What’s this project about? (optional)"
          multiline
        />
        <View style={styles.statusBlock}>
          <Text style={[typography.bodyStrong, styles.heading]}>Status</Text>
          <View style={styles.statusRow}>
            {STATUS_OPTIONS.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                variant="dark"
                selected={status === option.value}
                onPress={() => setStatus(option.value)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  heading: {
    color: colors.textPrimary,
  },
  statusBlock: {
    gap: spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  missing: {
    color: colors.textSecondary,
    paddingHorizontal: spacing.lg,
  },
});
