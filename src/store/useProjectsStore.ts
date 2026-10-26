import { collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { create } from 'zustand';

import type { Project } from '../data/types';
import { firestore } from '../services/firebase';
import { subscribeToQuery, type Subscription } from '../services/firestoreSync';

interface ProjectsState {
  projects: Project[];
  subscribe: () => Subscription;
  getProject: (id: string) => Project | undefined;
  getProjectsByOwner: (ownerId: string) => Project[];
  createProject: (input: { ownerId: string; title: string }) => Promise<Project>;
  touchProject: (id: string) => Promise<void>;
}

const projectsCollection = () => collection(firestore(), 'projects');

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  subscribe: () =>
    subscribeToQuery<Project>(projectsCollection(), (projects) => set({ projects }), 'projects'),
  getProject: (id) => get().projects.find((p) => p.id === id),
  getProjectsByOwner: (ownerId) =>
    get()
      .projects.filter((p) => p.ownerId === ownerId)
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)),
  createProject: async ({ ownerId, title }) => {
    const ref = doc(projectsCollection());
    const project: Project = {
      id: ref.id,
      ownerId,
      title,
      description: '',
      status: 'in_progress',
      collaboratorIds: [ownerId],
      updatedAt: new Date().toISOString(),
    };
    const { id: _id, ...data } = project;
    await setDoc(ref, data);
    return project;
  },
  touchProject: async (id) => {
    await updateDoc(doc(projectsCollection(), id), { updatedAt: new Date().toISOString() });
  },
}));
