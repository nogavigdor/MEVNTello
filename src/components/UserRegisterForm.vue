<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 class="text-3xl font-bold mb-6 text-primary">Register</h1>
      <form @submit.prevent="handleRegister">
        <div class="mb-4 relative">
          <label class="block text-gray-700 mb-1">Username</label>
          <div class="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-primary">
            <font-awesome-icon icon="user" class="w-5 h-5 text-primary mx-3" />
            <input
              v-model="form.username"
              type="text"
              class="w-full p-3 pl-10 pr-3 focus:outline-none rounded-lg"
              required
            />
          </div>
        </div>
        <div class="mb-4 relative">
          <label class="block text-gray-700 mb-1">Email</label>
          <div class="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-primary">
            <font-awesome-icon icon="envelope" class="w-5 h-5 text-primary mx-3" />
            <input
              v-model="form.email"
              type="email"
              class="w-full p-3 pl-10 pr-3 focus:outline-none rounded-lg"
              required
            />
          </div>
        </div>
        <div class="mb-4 relative">
          <label class="block text-gray-700 mb-1">Password</label>
          <div class="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-primary">
            <font-awesome-icon icon="lock" class="w-5 h-5 text-primary mx-3" />
            <input
              v-model="form.password"
              type="password"
              class="w-full p-3 pl-10 pr-3 focus:outline-none rounded-lg"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          class="w-full bg-primary text-white p-3 rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Register
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';

const form = ref({ username: '', email: '', password: '' });
const userStore = useUserStore();

const handleRegister = async () => {
  try {
    await userStore.register(form.value);
    alert('Registration successful');
  } catch (error) {
    alert('Registration failed');
    console.error(error);
  }
};
</script>
