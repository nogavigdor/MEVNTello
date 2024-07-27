<template>
    <div class="flex flex-col h-screen">
    <TheHeader />
    <TheMessage />
    <div class="flex flex-1">
      <SideBarMenu />
      <main class="flex-1 p-4 bg-gray-50">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>
<script setup>
import TheHeader from '@/components/TheHeader.vue';
import SideBarMenu from '@/components/SideBarMenu.vue';
import TheMessage from '@/components/TheMessage.vue';

</script>
