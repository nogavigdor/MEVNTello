import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Task } from '../interfaces/ITask';
import apiClient from '../services/apiClient';
import axios from 'axios';

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<Task[]>([]);

  //fetch tasks by list id
  const fetchTasks = async (listId: string) => {
    try {
      const response = await apiClient.get(`/tasks/${listId}`);
      tasks.value = response.data;
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  //create a new task
  const createTask = async (taskData: Task) => {
    try {
      const response = await apiClient.post('/tasks', taskData);
      tasks.value.push(response.data);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  //update a task by id
  const updateTask = async (taskId: string, updatedData: Partial<Task>) => {
    try {
      const response = await apiClient.put(`/tasks/${taskId}`, updatedData);
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
        await apiClient.delete(`/tasks/${taskId}`);
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
