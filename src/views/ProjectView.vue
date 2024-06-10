<template>
    <div>
      <h1>{{ project.name }}</h1>
      <!-- Display lists, tasks, and subtasks -->
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useProjectsStore } from '@/stores/projectsStore';
  
  const route = useRoute();
  const projectsStore = useProjectsStore();
  
  const project = ref(null);
  
  onMounted(async () => {
    project.value = await projectsStore.getProjectById(route.params.id);
  });
  </script>
  