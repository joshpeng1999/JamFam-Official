import { create } from 'zustand';

import { seedProjects } from '../data/seed';
import type { Project } from '../data/types';
import { loadCollection, saveCollection } from '../services/mockPersistence';

const STORAGE_KEY = 'projects';

interface ProjectsState {
  projects: Project[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  getProject: (id: string) => Project | undefined;
  getProjectsByOwner: (ownerId: string) => Project[];
  createProject: (input: { ownerId: string; title: string }) => Project;
  touchProject: (id: string) => void;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: seedProjects,
  hydrated: false,
  hydrate: async () => {
    if (get().hydrated) return;
    const projects = await loadCollection<Project>(STORAGE_KEY, seedProjects);
    set({ projects, hydrated: true });
  },
  getProject: (id) => get().projects.find((p) => p.id === id),
  getProjectsByOwner: (ownerId) => get().projects.filter((p) => p.ownerId === ownerId),
  createProject: ({ ownerId, title }) => {
    const project: Project = {
      id: `p_${Date.now()}`,
      ownerId,
      title,
      description: '',
      status: 'in_progress',
      collaboratorIds: [ownerId],
      updatedAt: new Date().toISOString(),
    };
    const projects = [project, ...get().projects];
    set({ projects });
    saveCollection(STORAGE_KEY, projects);
    return project;
  },
  touchProject: (id) => {
    const projects = get().projects.map((p) =>
      p.id === id ? { ...p, updatedAt: new Date().toISOString() } : p,
    );
    set({ projects });
    saveCollection(STORAGE_KEY, projects);
  },
}));
