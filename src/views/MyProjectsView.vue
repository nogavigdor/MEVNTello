<template>
    <div class="p-8">
      <h1 class="text-2xl font-bold text-primary mb-4">My Projects</h1>
      <ul class="space-y-4">
        <li v-for="project in projects" :key="project._id" class="p-4 bg-white rounded-lg shadow">
          <router-link :to="`/projects/${project._id}`" class="text-lg font-medium text-primary hover:underline">
            {{ project.name }}
          </router-link>
          <p>{{ project.description }}</p>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useProjectStore } from '@/stores/projectStore';
  
  const projectsStore = useProjectStore();
  const projects = ref(projectsStore.projects);
  
  onMounted(async () => {
    projects.value = await projectsStore.fetchProjects();
  });
  </script>
  