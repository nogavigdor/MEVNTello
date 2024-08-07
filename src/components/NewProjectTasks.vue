<template>
    <div class="flex space-x-4 overflow-x-auto">
        <div v-for="list in selectedTasksTemplate?.lists" :key="list._id" class="flex space-x-4">
            <h2 class="text-xl font-bold">{{ list.name }}</h2>
            <div class="ml-4">
            <div v-for="task in list.tasks" :key="task._id" class="flex justify-between items-center mb-2">
              <input type="text" v-model="task.name" />
              <div>
                <button @click="editTask(task._id)" class="text-blue-500 mr-2">Edit</button>
                <button @click="deleteTask(task._id, list._id)" class="text-red-500">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    <div class="p-8">
      <h1 class="text-2xl font-bold text-primary mb-4">Tasks Stage</h1>
      <div v-if="isLoading">Loading...</div>
      <div v-else>
        <div v-for="list in lists" :key="list._id" class="mb-4">
          <div class="flex justify-between items-center mb-2">
            <h2 class="text-xl font-bold">{{ list.name }}</h2>
            <button @click="deleteList(list._id)" class="text-red-500">Delete List</button>
          </div>
          <div class="ml-4">
            <div v-for="task in tasksByListId[list._id]" :key="task._id" class="flex justify-between items-center mb-2">
              <span>{{ task.name }}</span>
              <div>
                <button @click="editTask(task._id)" class="text-blue-500 mr-2">Edit</button>
                <button @click="deleteTask(task._id)" class="text-red-500">Delete</button>
              </div>
            </div>
          </div>
          <input v-model="newTaskName" placeholder="New task name" class="border rounded p-2 w-full mb-2" />
          <button @click="addTask(list._id)" class="bg-green-500 text-white py-2 px-4 rounded">Add Task</button>
        </div>
        <input v-model="newListName" placeholder="New list name" class="border rounded p-2 w-full mb-2" />
        <button @click="addList" class="bg-green-500 text-white py-2 px-4 rounded">Add List</button>
        <button @click="completeStage" class="bg-blue-500 text-white py-2 px-4 rounded mt-4">Proceed to Management Stage</button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useProjectStore } from '@/stores/projectStore';
  import { useTaskStore } from '@/stores/taskStore';
  import { Project } from '@/interfaces/IProject';
  import { Task } from '@/interfaces/ITask';
  import { List } from '@/interfaces/IList';
  import { useRoute } from 'vue-router';
  import ListPresentation from './ListPresentation.vue';
  import { TaskTemplate } from '@/interfaces/ITaskTemplate';
  
  const route = useRoute();
  const projectStore = useProjectStore();
  const tasksStore = useTaskStore();
  
  const projectId = route.query.projectId as string;
  const isLoading = ref<boolean>(true);
  const project = ref<Project | null>(null);
  const lists = ref<List[]>([]);
  const tasksByListId = ref<{ [key: string]: Task[] }>({});
  const newListName = ref<string>('');
  const newTaskName = ref<string>('');
 
  const selectedTasksTemplate = ref<TaskTemplate | null>(null);

  //building the lists tasks presentations according to the selected template
  //or creating a black presentation if no template is selected
  onMounted(async () => {
    try {
      project.value = await projectStore.fetchProjectById(projectId);
      if (project.value && project.value.selectedTemplate) {
        await tasksStore.fetchTaskTemplates();
        selectedTasksTemplate.value = tasksStore.taskTemplates.find((t: TaskTemplate) => t._id === project.value?.selectedTemplate) || null;
        console.log('selected tempalte is:', selectedTasksTemplate.value);
      }
    } catch (error) {
      console.error('Error fetching project or tasks:', error);
    } finally {
      isLoading.value = false;
    }
  });
  
  const addList = async () => {
    if (newListName.value.trim() === '') {
      alert('List name cannot be empty');
      return;
    }
    const newList = await tasksStore.createList(projectId, { name: newListName.value });
    lists.value.push(newList);
    newListName.value = '';
  };
  
  const addTask = async (listId: string) => {
    if (newTaskName.value.trim() === '') {
      alert('Task name cannot be empty');
      return;
    }
    const newTask = await tasksStore.createTask(listId, { name: newTaskName.value, description: '', hoursAllocated: 0, hoursUsed: 0, status: 'todo', assignedMembers: [], listId, subTasks: [] });
    if (!tasksByListId.value[listId]) {
      tasksByListId.value[listId] = [];
    }
    tasksByListId.value[listId].push(newTask);
    newTaskName.value = '';
  };
  
  const deleteList = async (listId: string) => {
    await tasksStore.deleteList(listId);
    lists.value = lists.value.filter(list => list._id !== listId);
    delete tasksByListId.value[listId];
  };
  
  const deleteTask = async (taskId: string, listId: string) => {
    const list = selectedTasksTemplate.value?.lists.find((list) => list._id === listId);
    if (!list) return;
    const taskIndex = list.tasks.findIndex((task) => task._id === taskId);
    list.tasks.splice(taskIndex, 1);
  };
  
  const editTask = (taskId: string) => {
    // Open a modal or navigate to an edit page
    console.log('Editing task:', taskId);
  };
  
  const completeStage = () => {
    projectStore.updateProject(projectId, { creationStatus: 'management' });
    router.push({ name: 'NewProjectManagement', query: { projectId } });
  };
  </script>
  
  <style scoped>
  /* Add any specific styles here */
  </style>
  