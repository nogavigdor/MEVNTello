<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <div class="w-full max-w-md">
      <h1 class="text-3xl font-semibold text-center mb-6">Login</h1>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label for="email" class="block text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            required
          />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
        >
          Login
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';

const email = ref('');
const password = ref('');
const userStore = useUserStore();

const login = async () => {
  try {
    await userStore.login({ email: email.value, password: password.value });
    alert('Login successful');
  } catch (error) {
    alert('Login failed');
    console.error(error);
  }
};
</script>
