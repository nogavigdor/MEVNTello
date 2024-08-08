<template>
    <div class="flex space-x-4 overflow-x-auto mt-8">
        <div  v-for="list in selectedTasksTemplate?.lists" :key="list._id" class="flex-col space-y-4">
            <span class="flex space-y-4">
            <h2 class="text-xl font-bold">{{ list.name }}</h2>
            <button @click="deleteList(list._id)" class="text-red-500">Delete List</button>
            </span>
            <div class="flex-col space-y-4 ml-4">
              <NewProjectTasksItem :list="list" />
          </div>
        </div>
      </div>
    <div class="p-8"></div>
      <div class="flex space-x-4">
        <input type="text" v-model="newListName" class="border border-gray-300 p-2" />
        <button @click="addList" class="bg-green-500 text-white py-2 px-4 rounded">Add List</button>
    </div>
    <button @click="completeStage" class="bg-accent text-white py-2 px-4 rounded mt-4">Save and Continue</button>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import { useProjectStore } from '@/stores/projectStore';
  import { useListStore } from '@/stores/listStore';
  import { useTaskStore } from '@/stores/taskStore';
  import { Project } from '@/interfaces/IProject';
  import { Task } from '@/interfaces/ITask';
  import { List } from '@/interfaces/IList';
  import { useRoute } from 'vue-router';
  import ListPresentation from './ListPresentation.vue';
  import { TaskTemplate } from '@/interfaces/ITaskTemplate';
  import router from '@/router';
import { add } from 'lodash';
import { randomString } from '@/utils/randomString';
import NewProjectTasksItem from './NewProjectTasksItem.vue';
  
  const route = useRoute();
  const projectStore = useProjectStore();
  const listStore = useListStore();
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
  
    selectedTasksTemplate.value?.lists.push({ _id: randomString(), name: newListName.value, tasks: [] });
    newListName.value = '';
  };
  
  const deleteList = (listId: string) => {
    const listIndex = selectedTasksTemplate.value?.lists.findIndex((list) => list._id === listId);
    if (listIndex === undefined) {
      return;
    }
    selectedTasksTemplate.value?.lists.splice(listIndex, 1,);
  };


  const completeStage = async () => {
    if (project.value) {
       for (const list of selectedTasksTemplate.value?.lists || []) {
        const newList = await listStore.createList({ name: list.name, projectId: project.value?._id ?? '', tasks: [] });
        for (const task of list.tasks) {
          await tasksStore.createTask(newList._id, {  
            listId: newList._id,
            name: task.name,
            description: '',
            status: 'todo',
            assignedMembers: [],
            hoursAllocated: 0,
            hoursUsed: 0,
            subTasks: []
          });
        }

        //fetching all the tasks of the newly created list
        await tasksStore.fetchTasks(newList._id);
        //creating a new list object with the new tasks that were created in the database
        const newListWithTasks = {
          _id: newList._id,
          name: newList.name,
          projectId: newList.projectId,
          //populating the list object with the new task that were created in the database
          tasks: tasksStore.tasks
        }
        console.log ('The newListWithTasks is:', newListWithTasks);
        //updating the list that was created earlier with en empty task array
        //with the new tasks that were created in the database according to the template
        await listStore.updateList(newListWithTasks);
    
        

      }

      
       // Fetch the created lists and update the project
    if (!project.value) {
      return;
    }
    const createdLists = await listStore.fetchLists(project.value._id ?? '');
    // Updating the project with the new lists that were created and the creation status
    project.value.lists = createdLists?.map(list => list._id); // Get only the IDs of the lists
    project.value.creationStatus = 'management';
    const newProject: Project & {__v?: string;} = {
      ...project.value,
    }
    delete newProject.__v;
    
    await projectStore.updateProject(newProject);

    // The navigational guard will redirect the user to the next stage
    router.replace(`/projects/${project.value._id}`);

  };
  };

  </script>
  
  <style scoped>
  /* Add any specific styles here */
  </style>
  