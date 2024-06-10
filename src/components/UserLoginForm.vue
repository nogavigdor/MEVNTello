<template>
  <form @submit.prevent="handleLogin">
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
      Login
    </button>
  </form>
</template>

<script setup lang="ts">

import { ref, defineEmits } from 'vue';
import { useUserStore } from '@/stores/userStore';
import router from '@/router';

const form = ref({ email: '', password: '' });
const userStore = useUserStore();
const emit = defineEmits(['loginSuccess']);

const handleLogin = async () => {
  try {
    console.log('Form Data:', form.value);  // Log form data
    await userStore.login(form.value);
    alert('Login successful');
    emit('loginSuccess');
    // Redirect to the dashboard after successful login
    router.push('/dashboard');
  } catch (error) {
    alert('Login failed');
    console.error('Login failed:', (error as any).response?.data || (error as any).message);
  }
};
</script>
