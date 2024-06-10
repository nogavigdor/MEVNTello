// src/stores/projectsStore.ts
import { defineStore } from 'pinia';
import apiClient from '../services/apiClient';
import { Project } from '../interfaces/IProject';


export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [] as Project[],
  }),
  actions: {
    async fetchProjects() {
      try {
        const response = await apiClient.get('/projects');
        this.projects = response.data;
        return this.projects;
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        throw error;
      }
    },
  },
});
