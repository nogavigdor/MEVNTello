import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Task } from '../interfaces/ITask';
import axios from 'axios';

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<Task[]>([]);

  //fetch tasks by list id
  const fetchTasks = async (listId: string) => {
    try {
      const response = await axios.get(`/api/tasks/${listId}`);
      tasks.value = response.data;
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const createTask = async (taskData: Task) => {
    try {
      const response = await axios.post('/api/tasks', taskData);
      tasks.value.push(response.data);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  return {
    tasks,
    fetchTasks,
    createTask,
  };
});
