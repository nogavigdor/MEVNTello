<template>
    <div class="p-8">
      <h1 class="text-2xl font-bold text-primary mb-4">Close to Overdue Tasks</h1>
      <div v-if="isLoading">Loading...</div>
      <div v-else>
        <ul class="space-y-4">
          <li v-for="task in closeToOverdueTasks" :key="task._id" class="p-4 bg-white rounded-lg shadow">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-lg font-medium">{{ task.name }}</p>
                <p>Hours Used: {{ task.hoursUsed }} / {{ task.hoursAllocated }}</p>
              </div>
              <router-link :to="`/projects/${task.projectId}`" class="text-primary hover:underline">
                View Project
              </router-link>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useUserStore } from '@/stores/userStore';
  import { useTaskStore } from '@/stores/taskStore';
  import { useProjectStore } from '@/stores/projectStore';
  import { Task } from '@/interfaces/ITask';
  
  const userStore = useUserStore();
  const taskStore = useTaskStore();
  const projectStore = useProjectStore();
  
  const isLoading = ref(true);
  let allmostOverdueTasks = ref<Task[]>([]);
  const userId = computed(() => userStore.user?._id);
  
  
  allmostOverdueTasks = computed(() => {
    return taskStore.getCloseToOverdueTasks();
  });
  
  
  onMounted(async () => {
    await taskStore.fetchAllTasks();
    isLoading.value = false;
  });
  </script>
  
  <style scoped>
 
  </style>
  