<template>
    <div v-if="username" class="text-primary">
      Welcome, {{ username }}!
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  import { useUserStore } from '@/stores/userStore';
  
  const userStore = useUserStore();
  const username = ref(userStore.getUsername);
  
  // Watch for changes in the store's state and update the local ref
  watch(() => userStore.user, (newUser) => {
    username.value = newUser?.username || null;
  });
  </script>
  