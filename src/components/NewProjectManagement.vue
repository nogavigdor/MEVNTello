<template>
    <div>
        <h1 class="text-2xl font-bold text-primary">{{ project?.name}}</h1>
        <h2 class="text-darkOrange font-bold"> Total Hours Allocated: {{  totalAllocatedHours }}/{{  project?.allocatedHours }}</h2>
    </div>

    <div class="flex space-y-4 overflow-x-auto mt-8">
        <ul v-for="list in lists" :key="list._id" class="flex-col space-x-4">
            {{ list.name }}
            <ul v-for="task in tasks?.filter(task => task.listId === list._id)" class="flex-col space-y-4">
               
                <li>{{ task.name }}</li>
                <li >Hours Allocated: <input v-model="task.hoursAllocated" type="number" /></li>
                <li><AssignMembers v-model="task.selectedMembers" :project-team-members="projectTeamMembers"/></li>
            </ul>
        </ul>
    </div>
    <button v-if="!isLoading" @click="completeStage" class="bg-accent text-white py-2 px-4 rounded mt-4">Save and Continue</button>
    <LoaderButton v-else />
    <progress v-if="isLoading" :value="progress" :max="totalItems" class="w-full"></progress>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed, watch } from 'vue';
  import { useProjectStore } from '@/stores/projectStore';
  import { uselistStore } from '@/stores/listStore';
  import { useTaskStore } from '@/stores/taskStore';
  import { Project } from '@/interfaces/IProject';
  import { Task } from '@/interfaces/ITask';
  import { List } from '@/interfaces/IList';
  import { useRoute, useRouter } from 'vue-router';
  import ListPresentation from './ListPresentation.vue';
  import { TaskTemplate } from '@/interfaces/ITaskTemplate';
import { add } from 'lodash';
import { randomString } from '@/utils/randomString';
import NewProjectTasksItem from './NewProjectTasksItem.vue';
import AssignMembers from './AssignMembers.vue';
import { getMemberName } from '@/utils/getMemberName';
import LoaderButton from './LoaderButton.vue';


  const route = useRoute();
  const router = useRouter();
  const projectStore = useProjectStore();
  const listStore = uselistStore();
  const tasksStore = useTaskStore();
  //holds the current project id which is fetched from the url params
  const projectId = route.query.projectId as string;
  const isLoading = ref<boolean>(false);
  const project = ref<Project | null>(null);
  const lists = ref<List[]>([]);
  const tasks = ref<Task[] | null>([]);

  const progress = ref<number>(0);
  const totalItems = computed(() => (tasks?.value?.length || 0) + 1);
 
 

  //building the lists tasks presentations according to the selected template
  //or creating a black presentation if no template is selected
  onMounted(async () => {
    try {
        //retrieving the current project by using the project id which was fetched from the url query.
      project.value = await projectStore.fetchProjectById(projectId);
      //retrieving all lists for the project
      const fetchedlists = await listStore.fetchLists(projectId);
      lists.value =  fetchedlists || [];
      //retrieving all tasks for the project
      const fetchedTasks = await tasksStore.fetchTasksByProject(projectId);
      tasks.value = fetchedTasks || [];
     
     
      
    } catch (error) {
      console.error('Error fetching project or tasks:', error);
    } finally {
      isLoading.value = false;
    }
  });
  


const projectTeamMembers = computed(() => {
    return project.value?.teamMembers ?? [];
  });

  const totalAllocatedHours = computed(() => {
      return tasks.value?.reduce((acc, task) => acc + parseInt(String(task.hoursAllocated)), 0) ?? 0;
  });



  const completeStage = async () => {
    isLoading.value = true;

    //runs over the tasks and updates the hours allocated, hours used and assigned members
        for (const task of tasks.value ?? []) {
          progress.value++;

          await tasksStore.updateTask(task._id, {  
            hoursAllocated: task.hoursAllocated,
            assignedMembers : task.selectedMembers?.map(id => {
                const member = projectTeamMembers.value.find(m => m._id === id);
                return member ? {
                    _id: member._id,
                    username: getMemberName(id),
                     role: member.role, usedHours: 0,
                } : { _id: id, username: 'Unknown', role: 'member', usedHours: 0 };
    }),
            
          });
        }

       // Fetch the created lists and update the project

    //const createdLists = await listStore.fetchLists(project.value._id ?? '');
    // Updating the project with the new lists that were created and the creation status
    //project.value.lists = createdLists?.map(list => list._id); // Get only the IDs of the lists
    progress.value++;
    const updatedProject = await projectStore.updateProject(
      {
       _id: project.value?._id, 
      creationStatus: 'complete',

      }  
    );
   
   // const newProject: Project & {__v?: string;} = {
   //   ...project.value,
   // }
    //delete newProject.__v;
    
    
    
    // The navigational guard will redirect the user to the project view
    //and the user will be able to see the new project that was created
    router.replace(`/projects/${updatedProject._id}`);

  };
 

  </script>
  
  <style scoped>
 
  </style>
  