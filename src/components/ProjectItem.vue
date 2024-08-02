<template>
    <div>
      <div v-if="presentation === 'kanban'" class="flex space-x-4 overflow-x-auto">
        <div v-for="status in statuses" :key="status" class="bg-gray-100 rounded-lg p-4 w-80">
          <h2 class="text-xl font-semibold mb-4">{{ statusLabels[status] }}</h2>
          <div v-for="task in tasksByStatus(status)" :key="task._id" class="mb-4">
            <TaskItem :task="task" :projectId="projectId" :isLeader="isLeader"/>
          </div>
        </div>
      </div>
      <div v-else class="flex space-x-4 overflow-x-auto">
        <ListItem v-for="list in listsStore.lists" :key="list._id" :list="list" :projectId="projectId" :isLeader="isLeader" />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, defineProps, onMounted } from 'vue';
  import { useTaskStore } from '@/stores/taskStore';
  import { useListStore } from '@/stores/listStore';
  import TaskItem from '@/components/TaskItem.vue';
  import ListItem from '@/components/ListItem.vue';
  import { Task } from '@/interfaces/ITask';
  
  const props = defineProps<{ projectId: string, presentation: 'kanban' | 'trello', isLeader: boolean }>();
  
  const tasksStore = useTaskStore();
  const listsStore = useListStore();
  
  const statuses = ['todo', 'inProgress', 'done'];
  const statusLabels: { [key: string]: string } = {
    todo: 'To Do',
    inProgress: 'In Progress',
    done: 'Done'
  };
  
  const tasksByStatus = (status: string) => {
    return tasksStore.tasks.filter(task => task.status === status);
  };
  </script>
  
  <style scoped>
  
  </style>
  