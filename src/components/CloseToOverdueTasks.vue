<template>
  <div class="p-8">
    <div v-if="isLoading">Loading...</div>
    <div v-else>
      <!-- Check if there are any almost overdue tasks -->
      <ul v-if="almostOverdueTasks.length > 0" class="space-y-4">
        <li v-for="task in almostOverdueTasks" :key="task._id" class="p-4 bg-white rounded-lg shadow">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-lg font-medium">{{ task.name }}</p>
              <p>Hours Used: {{ hoursUsed(task) }} / {{ task.hoursAllocated }}</p>
            </div>
            <router-link :to="`/projects/${projectIdForTask(task._id)}`" class="text-primary hover:underline">
              View Project
            </router-link>
          </div>
        </li>
      </ul>
      <!-- Message to show when there are no almost overdue tasks -->
      <p v-else class="text-gray-600">No tasks are close to being overdue.</p>
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
  const userId = computed(() => userStore.user?._id);
  
  const almostOverdueTasks = computed(() => {
    return taskStore.getCloseToOverdueTasks();
  });
  
  const projectIdForTask = (taskId: string) => taskStore.getProjectIdForTask(taskId);

  //calculate the total used hours that all the assigned members have used for a task
  const hoursUsed = (task: Task) => task.assignedMembers.reduce((acc, member) => acc + member.usedHours, 0);
  
  onMounted(async () => {
    try {
    //fetching all tasks for a logged in user
    await taskStore.fetchAllTasks();
    //fetch all projects for a logged in user
    await projectStore.fetchProjects();
  } catch (error:any) {
    error.value = 'Failed to load tasks. Please try again later.';
    console.error(error);
  } finally {
    isLoading.value = false;
  }
  });
  </script>
  
  <style scoped>
 
  </style>
  