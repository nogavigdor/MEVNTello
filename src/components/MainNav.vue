<template>
  <nav class="flex items-center justify-between p-4 bg-gray-100 shadow-md">
    <div>
      <router-link to="/" class="text-primary font-bold text-xl">Home</router-link>
    </div>
    <div class="flex items-center space-x-4">
      <div v-if="!isAuthenticated">
        <router-link to="/login" class="text-gray-700 hover:text-primary">Login</router-link>
        <router-link to="/register" class="text-gray-700 hover:text-primary">Register</router-link>
      </div>
      <div v-else class="flex items-center space-x-4">
        <WelcomeUser />
        <button @click="logout" class="text-gray-700 hover:text-primary">Logout</button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useUserStore } from '@/stores/userStore';
import WelcomeUser from '@/components/WelcomeUser.vue';

const userStore = useUserStore();
const isAuthenticated = ref(userStore.isAuthenticated);

// Watch for changes in the store's state and update the local ref
watch(() => userStore.isAuthenticated, (newStatus) => {
  isAuthenticated.value = newStatus;
});

// Logout function
const logout = () => {
  userStore.logout();
};
</script>
