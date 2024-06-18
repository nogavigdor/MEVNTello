<template>
    <div>
      <h1>{{ project.name }}</h1>
      <!-- Display lists, tasks, and subtasks -->
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useProjectStore } from '@/stores/projectStore';
  
  const route = useRoute();
  const projectsStore = useProjectStore();
  
  const project = ref(null);
  
  onMounted(async () => {
    project.value = await projectsStore.getProjectById(route.params.id);
  });
  </script>
  