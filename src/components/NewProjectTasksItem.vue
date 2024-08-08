<template>
    <div v-for="task in list.tasks" :key="task._id" class="flex justify-between items-center mb-2">
        <input type="text" v-model="task.name" />
        <div>
        <button @click="deleteTask(task._id)" class="text-red-500">Delete</button>
        </div>
    </div>
    <div>
        <input type="text" v-model="newTaskName" />
        <button @click="addTask" class="bg-green-500 text-white py-2 px-4 rounded">Add Task</button>
    </div>
</template>

<script setup lang="ts">
import type { TaskTemplateList } from '@/interfaces/ITaskTemplate';
import { defineProps, ref } from 'vue';
import { randomString } from '@/utils/randomString';

const props = defineProps<{ list: TaskTemplateList }>();

const newTaskName = ref('');

const addTask = async () => {
    if (newTaskName.value.trim() === '') {
      alert('Task name cannot be empty');
      return;
    }
    const newTask = { _id: randomString(), name: newTaskName.value, description: '' };
    props.list.tasks.push(newTask);
    newTaskName.value = '';
  };

  const deleteTask = async (taskId: string) => {
  
    const taskIndex = props.list.tasks.findIndex((task) => task._id === taskId);
    props.list.tasks.splice(taskIndex, 1);
  };
</script>