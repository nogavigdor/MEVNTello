<template>
    <div>
      <h1>{{ project?.name }}</h1>
      <p>{{ project?.description }}</p>
      <h2>Tasks:</h2>
      <ul>
      
      </ul>
      <h2>Members:</h2>
      <ul>
        <li v-for="member in project?.teamMembers" :key="member._id">
          <p>Role: {{ member?._id }}</p>
          <p>Role: {{ member?.role }}</p>
        </li>
      </ul>
      <h2> Creator: {{ project?.creator }}</h2>

      
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useProjectStore } from '@/stores/projectStore';
  import { Project } from '@/interfaces/IProject';
  
  const route = useRoute();
  const projectsStore = useProjectStore();
  
  const project = ref< Project | null>(null);
  
  onMounted(async () => {
    project.value = await projectsStore.getProjectById(route.params.id.toString());
  });
  </script>
  