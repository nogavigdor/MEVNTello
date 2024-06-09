<template>
    <div class="font-sans">
      <div class="container mx-auto mt-4">
        <UserRegisterForm v-model="form" @submit="register" />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import UserRegisterForm from '@/components/UserRegisterForm.vue';
  import { ref } from 'vue';
  
  const form = ref({ username: '', email: '', password: '' });
  </script>
  