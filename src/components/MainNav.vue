<template>
  <nav class="bg-primary p-4">
    <div class="container mx-auto">
      <router-link to="/" class="text-white mr-4 hover:text-secondary">Home</router-link>
      <router-link to="/login" class="text-white mr-4 hover:text-secondary">Login</router-link>
      <router-link to="/register" class="text-white hover:text-secondary">Register</router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
