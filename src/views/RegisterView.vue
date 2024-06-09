<template>
    <div class="font-sans">
      <div class="container mx-auto mt-4">
        <h1 class="text-2xl font-bold text-primary">Register</h1>
        <div class="min-h-screen bg-gray-100 flex items-center justify-center">
          <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
            <h1 class="text-2xl font-bold mb-6">Register</h1>
            <form @submit.prevent="register">
              <div class="mb-4">
                <label class="block text-gray-700">Username</label>
                <input
                  v-model="form.username"
                  type="text"
                  class="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div class="mb-4">
                <label class="block text-gray-700">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  class="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div class="mb-4">
                <label class="block text-gray-700">Password</label>
                <input
                  v-model="form.password"
                  type="password"
                  class="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <button
                type="submit"
                class="w-full bg-blue-500 text-white p-2 rounded mt-4"
              >
                Register
              </button>
            </form>
          </div>
          </div> 
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
    import { ref } from 'vue';
    import { useUserStore } from '@/stores/userStore';

    const form = ref({ username: '', email: '', password: '' });
    const userStore = useUserStore();

    const register = async () => {
      try {
        await userStore.register(form.value);
        alert('Registration successful');
      } catch (error) {
        alert('Registration failed');
        console.error(error);
      }
    };

    

  </script>
  
  <style scoped>
  .container {
    padding: 16px;
  }
  </style>
  