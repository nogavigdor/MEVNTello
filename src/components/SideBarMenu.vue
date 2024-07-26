<template>
    <aside class="bg-gray-100 text-primary shadow-md" v-if="isAuthenticated">
      <ul class="space-y-2 p-4">
        <li>
          <router-link to="/projects" class="block">My Projects</router-link>
        </li>
        <li>
          <router-link to="/projects/new" class="block">New Project</router-link>
        </li>
     
      </ul>
    </aside>
  </template>
  
  <script setup lang="ts">
  import {  computed } from 'vue';

  import { useUserStore } from '@/stores/userStore';

  
  const userStore = useUserStore();

 
  
  const isAuthenticated = computed(() => userStore.isAuthenticated);
  

  </script>
  