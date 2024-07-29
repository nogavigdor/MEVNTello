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

  //create a new task
  const createTask = async (taskData: Task) => {
    try {
      const response = await axios.post('/api/tasks', taskData);
      tasks.value.push(response.data);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  //update a task by id
  const updateTask = async (taskId: string, updatedData: Partial<Task>) => {
    try {
      const response = await axios.put(`/api/tasks/${taskId}`, updatedData);
      const index = tasks.value.findIndex((t) => t._id === taskId);
      if (index !== -1) {
        tasks.value[index] = response.data;
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  //delete a task by id
    const deleteTask = async (taskId: string) => {
        try {
        await axios.delete(`/api/tasks/${taskId}`);
        tasks.value = tasks.value.filter((t) => t._id !== taskId);
        } catch (error) {
        console.error('Failed to delete task:', error);
        }
    };


  return {
    tasks,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
});
