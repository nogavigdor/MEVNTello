<template>
  <div v-if="message" :class="messageClass" class="message px-4 py-3 rounded relative" role="alert">
    <span class="block sm:inline">{{ message.text }}</span>
    <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
      <svg class="fill-current h-6 w-6" role="button" @click="clearMessage" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <title>Close</title>
        <path d="M14.348 5.652a.5.5 0 00-.707 0L10 9.293 6.36 5.652a.5.5 0 00-.707.707L9.293 10l-3.64 3.64a.5.5 0 00.707.707L10 10.707l3.64-3.64a.5.5 0 000-.707z"/>
        </svg>
      </span>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMessageStore } from '@/stores/messageStore';

const messageStore = useMessageStore();
const message = computed(() => messageStore.message);
const clearMessage = messageStore.clearMessage;


const messageClass = computed(() => {
  switch (message.value?.type) {
    case 'error':
      return 'bg-red-100 border border-red-400 text-red-700';
    case 'warning':
      return 'bg-yellow-100 border border-yellow-400 text-yellow-700';
    case 'success':
      return 'bg-green-100 border border-green-400 text-green-700';
    default:
      return '';
  }
});
</script>

<style scoped>
.message {
  margin-top: 20px;
}
</style>
