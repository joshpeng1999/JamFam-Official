import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Chip } from '../components/ui/Chip';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { TextField } from '../components/ui/TextField';
import { COLLABORATOR_ROLES, type Prompt } from '../src/data/types';
import { useAuthStore, useCurrentUserId } from '../src/store/useAuthStore';
import { useUsersStore, type ProfileInput } from '../src/store/useUsersStore';
import { avatarPalette, colors, spacing, typography } from '../src/theme';

const PROMPT_QUESTIONS = [
  'If I could jam with any artist, living or dead, it’d be…',
  'What’s your go-to song to kick off a jam session?',
  'Music connects people because…',
];

const splitList = (text: string) =>
  text
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

// Used both for first-time onboarding (no `users/{uid}` doc yet) and for
// "Edit Profile" from the profile tab.
export default function ProfileSetupScreen() {
  const insets = useSafeAreaInsets();
  const uid = useCurrentUserId();
  const existing = useUsersStore((s) => s.getUser(uid));
  const saveProfile = useUsersStore((s) => s.saveProfile);
  const signOut = useAuthStore((s) => s.signOut);
  const isEditing = Boolean(existing);

  const instagram = existing?.socialLinks.find((l) => l.label === 'Instagram')?.url ?? '';
  const [name, setName] = useState(existing?.name ?? '');
  const [pronouns, setPronouns] = useState(existing?.pronouns ?? '');
  const [location, setLocation] = useState(existing?.location ?? '');
  const [tagline, setTagline] = useState(existing?.tagline ?? '');
  const [bio, setBio] = useState(existing?.bio ?? '');
  const [roles, setRoles] = useState<string[]>(existing?.roles ?? []);
  const [influences, setInfluences] = useState(existing?.musicalInfluences.join(', ') ?? '');
  const [genres, setGenres] = useState(existing?.preferredGenres.join(', ') ?? '');
  const [instagramUrl, setInstagramUrl] = useState(instagram);
  const [portfolioUrl, setPortfolioUrl] = useState(existing?.portfolioUrl ?? '');
  const [answers, setAnswers] = useState<string[]>(
    PROMPT_QUESTIONS.map((q) => existing?.prompts.find((p) => p.question === q)?.answer ?? ''),
  );
  const [saving, setSaving] = useState(false);

  const canSave = name.trim().length > 0 && location.trim().length > 0 && roles.length > 0;

  const toggleRole = (role: string) =>
    setRoles((current) => (current.includes(role) ? current.filter((r) => r !== role) : [...current, role]));

  const save = async () => {
    if (!canSave) return;
    setSaving(true);
    const prompts: Prompt[] = PROMPT_QUESTIONS.map((question, i) => ({ question, answer: answers[i].trim() })).filter(
      (p) => p.answer.length > 0,
    );
    const profile: ProfileInput = {
      name: name.trim(),
      pronouns: pronouns.trim() || undefined,
      age: existing?.age,
      location: location.trim(),
      tagline: tagline.trim(),
      bio: bio.trim(),
      roles,
      avatarColor: existing?.avatarColor ?? avatarPalette[Math.floor(Math.random() * avatarPalette.length)],
      socialLinks: instagramUrl.trim() ? [{ label: 'Instagram', url: instagramUrl.trim() }] : [],
      portfolioUrl: portfolioUrl.trim() || undefined,
      musicalInfluences: splitList(influences),
      preferredGenres: splitList(genres),
      prompts,
    };
    try {
      await saveProfile(uid, profile);
      if (isEditing) {
        router.back();
      } else {
        router.replace('/(tabs)');
      }
    } catch (e) {
      console.warn('[profile] save failed', e);
      Alert.alert('Couldn’t save profile', 'Check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  const confirmSignOut = () =>
    Alert.alert('Sign out?', undefined, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => signOut() },
    ]);

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        {isEditing ? (
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </Pressable>
        ) : (
          <View />
        )}
        <Text style={[typography.subtitle, styles.light]}>{isEditing ? 'Edit Profile' : 'Set Up Your Profile'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxxl }]}
        keyboardShouldPersistTaps="handled"
      >
        <TextField label="Name *" value={name} onChangeText={setName} placeholder="Your artist or real name" />
        <TextField label="Location *" value={location} onChangeText={setLocation} placeholder="City, or “Remote”" />
        <TextField label="Pronouns" value={pronouns} onChangeText={setPronouns} placeholder="e.g. she/her" />
        <TextField
          label="Tagline"
          value={tagline}
          onChangeText={setTagline}
          placeholder="One line about you as an artist"
        />
        <TextField label="Bio" value={bio} onChangeText={setBio} placeholder="What do you make?" multiline />

        <View style={styles.section}>
          <Text style={[typography.bodyStrong, styles.light]}>What do you do? *</Text>
          <View style={styles.chips}>
            {COLLABORATOR_ROLES.filter((r) => r !== 'Feedback').map((role) => (
              <Chip key={role} label={role} variant="dark" selected={roles.includes(role)} onPress={() => toggleRole(role)} />
            ))}
          </View>
        </View>

        <TextField
          label="Musical influences"
          value={influences}
          onChangeText={setInfluences}
          placeholder="Radiohead, Norah Jones, …"
          hint="Separate with commas"
        />
        <TextField
          label="Preferred genres"
          value={genres}
          onChangeText={setGenres}
          placeholder="Indie Folk, Jazz, …"
          hint="Separate with commas"
        />
        <TextField
          label="Instagram"
          value={instagramUrl}
          onChangeText={setInstagramUrl}
          placeholder="https://instagram.com/you"
          autoCapitalize="none"
          keyboardType="url"
        />
        <TextField
          label="Portfolio / website"
          value={portfolioUrl}
          onChangeText={setPortfolioUrl}
          placeholder="https://"
          autoCapitalize="none"
          keyboardType="url"
        />

        <Text style={[typography.subtitle, styles.light, styles.sectionTitle]}>Get to Know Me</Text>
        {PROMPT_QUESTIONS.map((question, i) => (
          <TextField
            key={question}
            label={question}
            value={answers[i]}
            onChangeText={(text) => setAnswers((current) => current.map((a, j) => (j === i ? text : a)))}
            placeholder="Optional"
            multiline
          />
        ))}

        <PrimaryButton
          label={isEditing ? 'Save Changes' : 'Start Jamming'}
          onPress={save}
          disabled={!canSave}
          loading={saving}
          style={styles.saveButton}
        />
        {isEditing && <PrimaryButton label="Sign Out" variant="outline" onPress={confirmSignOut} />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.lg,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    marginTop: spacing.md,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  light: {
    color: colors.textPrimary,
  },
  saveButton: {
    marginTop: spacing.lg,
  },
});
