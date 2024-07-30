import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiClient from '../services/apiClient';
import { Project } from '../interfaces/IProject';

export const useProjectStore = defineStore('projects', () => {
  const projects = ref<Project[]>([]);

  const fetchProjects = async () => {
    try {
      const response = await apiClient.get('/projects');
      projects.value = response.data;
      return projects.value;
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      throw error;
    }
  };

  const fetchProjectById = async (projectId: string) => {
    try {
      const response = await apiClient.get(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch project:', error);
      throw error;
    }
  }

  const fetchProjectByUserId = async (userId: string) => {
    try {
      const response = await apiClient.get(`/projects/user/${userId}`);
      projects.value = response.data;
      return projects.value;
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      throw error;
    }
  };

  const createProject = async (projectData: Project) => {
    try {
      const response = await apiClient.post('/projects', projectData);
      projects.value.push(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  };

  const updateProject = async (projectData: Project) => {
    try {
      const response = await apiClient.put(`/projects/${projectData._id}`, projectData);
      const index = projects.value.findIndex((p) => p._id === projectData._id);
      if (index !== -1) {
        projects.value[index] = response.data;
      }
      return response.data;
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      await apiClient.delete(`/projects/${projectId}`);
      projects.value = projects.value.filter((p) => p._id !== projectId);
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw error;
    }
  };

  const addTeamMember = async (projectId: string, memberId: string) => {
    try {
      const response = await apiClient.post(`/projects/${projectId}/team`, { memberId });
      const projectIndex = projects.value.findIndex((p) => p._id === projectId);
      if (projectIndex !== -1) {
        projects.value[projectIndex] = response.data;
      }
      return response.data;
    } catch (error) {
      console.error('Failed to add team member:', error);
      throw error;
    }
  };

  const removeTeamMember = async (projectId: string, memberId: string) => {
    try {
      const response = await apiClient.delete(`/projects/${projectId}/team/${memberId}`);
      const projectIndex = projects.value.findIndex((p) => p._id === projectId);
      if (projectIndex !== -1) {
        projects.value[projectIndex] = response.data;
      }
      return response.data;
    } catch (error) {
      console.error('Failed to remove team member:', error);
      throw error;
    }
  };

  const getProjectById = (projectId: string) => {
    return projects.value.find((p) => p._id === projectId);
  };

  const getTeamMemberRole = (projectId: string, memberId: string) => {
    const project = projects.value.find((p) => p._id === projectId);
    if (!project) return null;
    const teamMember = project.teamMembers.find((m) => m._id === memberId);
    return teamMember ? teamMember.role : null;
  };

  return {
    projects,
    fetchProjects,
    fetchProjectById,
    fetchProjectByUserId,
    createProject,
    updateProject,
    deleteProject,
    addTeamMember,
    removeTeamMember,
    getProjectById,
    getTeamMemberRole,
  };
});
