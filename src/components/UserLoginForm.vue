<template>
  <form @submit.prevent="handleLogin">
    <div class="mb-4 relative">
  
      <label for="email" class="block text-gray-700 mb-1">Email</label>
      <div class="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-primary">
        <font-awesome-icon icon="envelope" class="w-5 h-5 text-primary mx-3" />
        <input
          v-model="form.email"
          type="email"
          id="email"
          class="w-full p-3 pl-10 pr-3 focus:outline-none rounded-lg"
          required autocomplete = "email"
        />
      </div>
    </div>
    <div class="mb-4 relative">
      <label for="password" class="block text-gray-700 mb-1">Password</label>
      <div class="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-primary">
        <font-awesome-icon icon="lock" class="w-5 h-5 text-primary mx-3" />
        <input
          v-model="form.password"
          type="password" 
          id="password"
          class="w-full p-3 pl-10 pr-3 focus:outline-none rounded-lg"
          required autocomplete = "current-password"
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
import { useMessageStore } from '@/stores/messageStore';


const form = ref({ email: '', password: '' });
const userStore = useUserStore();
const messageStore = useMessageStore();
const emit = defineEmits(['loginSuccess']);

const handleLogin = async () => {
  try {
    console.log('Form Data:', form.value);  // Log form data
    await userStore.login(form.value);
    // Emit the loginSuccess event
    emit('loginSuccess');
      // Set the success message in the store
    messageStore.setMessage(
    'You are now logged in.',
    'success'
    );
    
  } catch (error) {
    alert('Login failed');
    console.error('Login failed:', (error as any).response?.data || (error as any).message);
  }
};
</script>
