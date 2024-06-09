<template>
    <div class="font-sans min-h-screen bg-gray-100">
      <Header />
      <div class="flex items-center justify-center mt-8">
        <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 class="text-3xl font-bold mb-6 text-primary">Login</h1>
          <UserLoginForm @loginSuccess="handleLoginSuccess" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
    import UserLoginForm from '@/components/UserLoginForm.vue';
    import { ref, watch } from 'vue';
    import { useUserStore } from '@/stores/userStore';

    // Define the reactive variables
    const userStore = useUserStore();
    const username = ref(userStore.getUsername);
    const user = ref(userStore.getUser);

    // Define the method to handle login success and update the welcome user variable
    const handleLoginSuccess = () => {
      username.value = userStore.getUsername;
      user.value = userStore.getUser;
    };

    // Watch for changes in the store's state and update the local refs
    watch(() => userStore.user, (newUser) => {
    username.value = newUser?.username || null;
    user.value = newUser || null;
    });

  </script>
  
  <style scoped>
  .container {
    padding: 16px;
  }
  </style>
  