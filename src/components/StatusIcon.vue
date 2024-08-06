<template>
    <div :class="statusClass" :title="tooltip">
      <font-awesome-icon :icon="icon" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, computed } from 'vue';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import { library } from '@fortawesome/fontawesome-svg-core';
  import { faCheckCircle, faExclamationCircle, faHourglassHalf, faCircle } from '@fortawesome/free-solid-svg-icons';
  
  // Add the icons to the library
  library.add(faCheckCircle, faExclamationCircle, faHourglassHalf, faCircle);
  
  const props = defineProps<{ status: string }>();
  
  const statusClass = computed(() => {
    switch (props.status) {
      case 'Completed':
        return 'text-green-500';
      case 'inProgress':
        return 'text-yellow-500';
      case 'overdue':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  });
  
  const icon = computed(() => {
    switch (props.status) {
      case 'Completed':
        return 'check-circle';
      case 'inProgress':
        return 'hourglass-half';
      case 'overdue':
        return 'exclamation-circle';
      default:
        return 'circle';
    }
  });
  
  const tooltip = computed(() => {
    switch (props.status) {
      case 'Completed':
        return 'This project is completed.';
      case 'inProgress':
        return 'This project is in progress.';
      case 'overdue':
        return 'This project is overdue.';
      default:
        return 'Status unknown.';
    }
  });
  </script>
  
  <style scoped>
  
  </style>
  