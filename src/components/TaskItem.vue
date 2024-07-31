<template>
    <div class="bg-white rounded-lg p-4 shadow-md">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-lg font-medium">{{ task.name }}</h3>
        <div v-if="isLeader || isTaskMember(task)" class="space-x-2">
          <button class="text-blue-500 hover:text-blue-700" @click="editTask(task._id)">✏️</button>
          <button v-if="isLeader" class="text-red-500 hover:text-red-700" @click="deleteTask(task._id)">🗑️</button>
        </div>
      </div>
      <p class="mb-2">Allocated Hours: {{ task.hoursAllocated }}</p>
      <p class="mb-2">Used Hours: 
        <span v-if="isLeader || isTaskMember(task)">
          <input type="number" v-model="task.hoursUsed" class="border rounded px-2 py-1 w-full" @change="updateHoursUsed(task)" />
        </span>
        <span v-else>{{ task.hoursUsed }}</span>
      </p>
      <div class="flex flex-wrap space-x-2">
        <span class="bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700" v-for="member in task.assignedMembers" :key="member._id">{{ member._id }}</span>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, defineProps } from 'vue';
  import { useTaskStore } from '@/stores/taskStore';
  import { useUserStore } from '@/stores/userStore';
  import { Task } from '@/interfaces/ITask';
  import { Project } from '@/interfaces/IProject';
  import { useProjectStore } from '@/stores/projectStore';
  
  const props = defineProps<{ task: Task, projectId: string }>();
  
  const tasksStore = useTaskStore();
  const userStore = useUserStore();
  const projectStore = useProjectStore();
  
  const project = computed<Project | undefined>(() => projectStore.getProjectById(props.projectId));
  const isLeader = computed(() => {
    return project.value?.teamMembers.some(member => member._id === userStore.user?._id && member.role === 'leader');
  });
  
  const isTaskMember = (task: Task) => {
    return task.assignedMembers.some(member => member._id === userStore.user?._id);
  };
  
  const editTask = (taskId: string) => {
    // Handle edit task logic
  };
  
  const deleteTask = async (taskId: string) => {
    await tasksStore.deleteTask(taskId);
    // Additional logic if needed
  };
  
  const updateHoursUsed = async (task: Task) => {
    await tasksStore.updateTask(task._id, { hoursUsed: task.hoursUsed });
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  