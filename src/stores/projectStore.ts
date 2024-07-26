// src/stores/projectsStore.ts
import { defineStore } from 'pinia';
import apiClient from '../services/apiClient';
import { Project } from '../interfaces/IProject';

// Define the project store using Pinia.
export const useProjectStore = defineStore('projects', {
  state: () => ({
    projects: [] as Project[],
  }),
  actions: {
    // Fetch all projects
    async fetchProjects() {
      try {
        const response = await apiClient.get('/projects');
        this.projects = response.data;
        return this.projects;
      } catch (error: unknown) {
        console.error('Failed to fetch projects:', error);
        throw error;
      }
    },
    // Fetch all projects by user ID
    async getProjectByUserId(userId: string) {
      try {
        const response = await apiClient.get(`/projects/user/${userId}`);
        this.projects = response.data;
        console.log('Projects by user fetched:', this.projects);
        return response.data;
      } catch (error: unknown) {
        console.error('Failed to fetch project:', error);
        throw error;
      }
    },
    // Create a new project
    async createProject(projectData: Project) {
      try {
        const response = await apiClient.post('/projects', projectData);
        this.projects.push(response.data); 
      } catch (error: unknown) {
        console.error('Failed to create project:', (error as Error & { response?: { data: unknown } }).response?.data);
        throw error;
      }
    },
    // Update a project by ID
    async updateProject(projectData: Project) {
      try {
        const response = await apiClient.put(`/projects/${projectData._id}`, projectData);
        const index = this.projects.findIndex((p) => p._id === projectData._id);
        if (index !== -1) {
          this.projects[index] = response.data;
        }
      } catch (error: unknown) {
        console.error('Failed to update project:', error);
        throw error;
      }
    },
    // Delete a project by ID
    async deleteProject(projectId: string) {
      try {
        await apiClient.delete(`/projects/${projectId}`);
        this.projects = this.projects.filter((p) => p._id !== projectId);
      } catch (error: unknown) {
        console.error('Failed to delete project:', error);
        throw error;
      }
    },
    // Add a team member to a project
    async addTeamMember(projectId: string, memberId: string) {
      try {
        const response = await apiClient.post(`/projects/${projectId}/team`, { memberId });
        const projectIndex = this.projects.findIndex((p) => p._id === projectId);
        if (projectIndex !== -1) {
          this.projects[projectIndex] = response.data;
        }
      } catch (error: unknown) {
        console.error('Failed to add team member:', error);
        throw error;
      }
    },
    // Remove a team member from a project
    async removeTeamMember(projectId: string, memberId: string) {
      try {
        const response = await apiClient.delete(`/projects/${projectId}/team/${memberId}`);
        const projectIndex = this.projects.findIndex((p) => p._id === projectId);
        if (projectIndex !== -1) {
          this.projects[projectIndex] = response.data;
        }
      } catch (error: unknown) {
        console.error('Failed to remove team member:', error);
        throw error;
      }
    },
    // Fetch a single project by ID
    async getProjectById(projectId: string) {
      try {
        const response = await apiClient.get(`/projects/${projectId}`);
        return response.data;
      } catch (error: unknown) {
        console.error('Failed to fetch project:', error);
        throw error;
      }
    },
    
  },
});
