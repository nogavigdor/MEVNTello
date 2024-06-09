<template>
    <div class="font-sans">
      <div class="container mx-auto mt-4">
        <h1 class="text-2xl font-bold text-primary">Login</h1>
        <UserLoginForm />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
    import UserLoginForm from '@/components/UserLoginForm.vue';
  </script>
  
  <style scoped>
  .container {
    padding: 16px;
  }
  </style>
  