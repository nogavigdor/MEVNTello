import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Task, NewTask } from '../interfaces/ITask';
import { TaskTemplate } from '@/interfaces/ITaskTemplate';
import apiClient from '../services/apiClient';
import axios from 'axios';

export const useTaskStore = defineStore('task', () => {
  
  //two dimensional array of lists (id's) and their tasks (Task objects)
  const tasksByListId = ref<{ [key: string]: Task[] }>({});

  //array of all tasks for a specific project
  const tasks = ref<Task[]>([]);

  //array of all tasks for a specific user
  const userTasks = ref<Task[]>([]);

  //array of all tasks templates
  const taskTemplates = ref<TaskTemplate[]>([]);




  //fetch tasks by list id
  const fetchTasks = async (listId: string) => {
    try {
      const response = await apiClient.get(`/tasks/list/${listId}`);
      tasksByListId.value[listId] = response.data;
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  //fetch all tasks for a logged in user
  const fetchAllTasks = async () => {
    try {
      const response = await apiClient.get(`/tasks`);
      userTasks.value = response.data;
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  //get all tasks have at at least 90% usage of their allocated hours
 const getCloseToOverdueTasks = () => {
   return tasks.value.filter(task => task.hoursUsed >= task.hoursAllocated * 0.9);
  }

  //fetch all tasks for a project
  const fetchTasksByProject = async (projectId: string) => {
    try {
      const response = await apiClient.get(`/tasks/project/${projectId}`);
      tasks.value = response.data;
      return tasks.value;
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  }

  //fetch all tasks templates
  const fetchTaskTemplates = async () => {
    try {
      const response = await apiClient.get(`/tasks/templates`);
      taskTemplates.value = response.data;
      return response.data;
    } catch (error) {
      console.error('Failed to fetch task templates:', error);
    }
  };

  //get a task by task's id
    const getTaskById = (taskId: string) => {
      for (const listId in tasksByListId.value) {
        const task = tasksByListId.value[listId].find(t => t._id === taskId);
        if (task) {
          return task;
        }
      }
      return null;
    };

  //create a new task
  const createTask = async (listId: string, taskData: NewTask) => {
    try {
      const response = await apiClient.post(`/tasks/${listId}`, taskData);
      const task = response.data;
      if (!tasksByListId.value[task.listId]) {
        tasksByListId.value[task.listId] = [];
      }
      tasksByListId.value[task.listId].push(task);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  //update a task by id
  const updateTask = async (taskId: string, updatedData: Partial<Task>) => {
    try {
      const response = await apiClient.put(`/tasks/${taskId}`, updatedData);
      const updatedTask = response.data;
      for (const listId in tasksByListId.value) {
        const index = tasksByListId.value[listId].findIndex(t => t._id === taskId);
        if (index !== -1) {
          tasksByListId.value[listId][index] = updatedTask;
        }
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

 
  //delete a task by id
    const deleteTask = async (taskId: string) => {
      try {
        await apiClient.delete(`/tasks/${taskId}`);
        for (const listId in tasksByListId.value) {
          tasksByListId.value[listId] = tasksByListId.value[listId].filter(t => t._id !== taskId);
        }
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    };


  return {
    tasksByListId,
    fetchAllTasks,
    fetchTasks,
    fetchTasksByProject,
    getCloseToOverdueTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    tasks,
    fetchTaskTemplates,
    taskTemplates,
  };
});
