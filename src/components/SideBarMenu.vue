<template>
    <aside class="bg-gray-100 text-primary shadow-md" v-if="isAuthenticated">
      <ul class="space-y-2 p-4">
        <li>
          <router-link to="/projects" class="block">My Projects</router-link>
        </li>
        <li>
          <router-link to="/projects/new" class="block">New Project</router-link>
        </li>
        <li v-for="project in projects" :key="project.id">
          <router-link :to="`/projects/${project.id}`" class="block">
            {{ project.name }}
          </router-link>
        </li>
      </ul>
    </aside>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref, computed } from 'vue';
  import { useProjectsStore } from '@/stores/projectStore';
  import { useUserStore } from '@/stores/userStore';
  import { Project } from '@/interfaces/IProject';
  
  const userStore = useUserStore();
  const projectsStore = useProjectsStore();
  
  const projects = ref<Project[]>([]);
  
  const isAuthenticated = computed(() => userStore.isAuthenticated);
  
  onMounted(async () => {
    if (isAuthenticated.value) {
      try {
        projects.value = await projectsStore.fetchProjects();
      } catch (error) {
        console.error('Failed to load projects:', error);
      }
    }
  });
  </script>
  