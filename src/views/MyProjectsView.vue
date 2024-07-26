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
  import { onMounted, ref, computed, watch } from 'vue';
  import { useProjectStore } from '@/stores/projectStore';
  import { useUserStore } from '@/stores/userStore';
  
  const projectsStore = useProjectStore();
  const projects = ref(projectsStore.projects);

  const userStore = useUserStore();
  const userId = computed(() => userStore.user?._id);

 console.log('the user id is:',userId);

  watch(userId, async (newUserId) => {
    console.log('the new user id:',newUserId);
    // const id = 
    if (newUserId) {
      projects.value = await projectsStore.getProjectByUserId(newUserId);
    }
  });

  onMounted(async () => {
    if (userId.value) {
      projects.value = await projectsStore.getProjectByUserId(userId.value);
    }
  });

  </script>
  