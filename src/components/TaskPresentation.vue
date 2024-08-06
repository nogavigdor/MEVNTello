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
          <input type="number" v-model="inputHoursUsed" class="border rounded px-2 py-1 w-full" @input="onInputChange" />
        </span>
        <span v-else>{{ task.hoursUsed }}</span>
      </p>
      <p class="mb-2">Status:</p>
        <div class="flex mb-2">
          <label class="inline-flex items-center mr-4">
            <input type="radio" v-model="task.status" value="todo" class="form-radio" @change="updateTaskStatus(task)" />
            <span class="ml-2">To Do</span>
          </label>
          <label class="inline-flex items-center mr-4">
            <input type="radio" v-model="task.status" value="inProgress" class="form-radio" @change="updateTaskStatus(task)" />
            <span class="ml-2">In Progress</span>
          </label>
          <label class="inline-flex items-center">
            <input type="radio" v-model="task.status" value="done" class="form-radio" @change="updateTaskStatus(task)" />
            <span class="ml-2">Done</span>
          </label>
        </div>
    <div class="mb-2">
      <label for="progress">Progress: {{ props.task.hoursUsed }} / {{ props.task.hoursAllocated }} hours</label>
      <progress id="progress" :value="progress" max="100" class="w-full"></progress>
    </div>
      <div class="flex flex-wrap space-x-2">
        <span class="bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700" v-for="member in task.assignedMembers" :key="member._id">{{ member.username }}</span>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, defineProps } from 'vue';
  import { ref } from 'vue';
  import { useTaskStore } from '@/stores/taskStore';
  import { useUserStore } from '@/stores/userStore';
  import { Task } from '@/interfaces/ITask';
  import { Project } from '@/interfaces/IProject';
  import { useProjectStore } from '@/stores/projectStore';
  //handles the debouncing of the input field
  import { debounce} from 'lodash';
  
  const props = defineProps<{ task: Task, projectId: string, isLeader: boolean }>();
  
  const tasksStore = useTaskStore();
  const userStore = useUserStore();
  const projectStore = useProjectStore();

  const inputHoursUsed = ref(props.task.hoursUsed);
  
  const project = computed<Project | undefined>(() => projectStore.getProjectById(props.projectId));
  
  
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

  const updateTaskStatus = async (task: Task) => {
  await tasksStore.updateTask(task._id, { status: task.status });
};

const debouncedUpdateHoursUsed = debounce(async (task: Task) => {
  if (task.hoursUsed > task.hoursAllocated) {
    alert('Used hours exceed allocated hours!');
  }
  await tasksStore.updateTask(task._id, { hoursUsed: task.hoursUsed });
}, 300); 

const onInputChange = () => {
  props.task.hoursUsed = inputHoursUsed.value;
  debouncedUpdateHoursUsed(props.task);
};

const progress = computed(() => {
  return Math.min((props.task.hoursUsed / props.task.hoursAllocated) * 100, 100);
});
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  