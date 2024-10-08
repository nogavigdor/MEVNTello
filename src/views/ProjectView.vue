<template>
  <div class="p-6">
    <h1 class="text-2xl text-green-500 font-bold mb-4">{{ project?.name }}</h1>
    <p class="mb-6 text-green-500 text-xl">{{ project?.description }}</p>
    <p>You are a <span class="text-darkOrange">{{ isLeader ? 'leader' : 'member' }}</span>  in this project</p>
    
    <div class="flex justify-end mb-4">
      <button @click="togglePresentation" class="bg-blue-500 text-white p-2 rounded">
        Switch to {{ presentation === 'kanban' ? 'Trello' : 'Kanban' }} View
      </button>
    </div>

    <ProjectPresentation :projectId="project?._id ?? ''" :presentation="presentation" :isLeader="isLeader" />
    
    <div v-if="isLeader && presentation=='trello'">
      <button class="bg-green-500 text-white p-2 rounded" @click="showAddListModal = true">Add List</button>
    </div>
    
    <div v-if="showAddListModal" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div class="bg-white p-6 rounded shadow-lg w-96">
        <h2 class="text-xl font-bold mb-4">Add New List</h2>
        <input v-model="newListName" class="border rounded w-full p-2 mb-4" placeholder="List Name" />
        <div class="flex justify-end space-x-2">
          <button class="bg-gray-500 text-white p-2 rounded" @click="showAddListModal = false">Cancel</button>
          <button class="bg-blue-500 text-white p-2 rounded" @click="addList">Add</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useProjectStore } from '@/stores/projectStore';
import { uselistStore } from '@/stores/listStore';
import { useTaskStore } from '@/stores/taskStore';
import { Project } from '@/interfaces/IProject';
import ProjectPresentation from '@/components/ProjectPresentation.vue'; // Adjust the path accordingly
import { useUserStore } from '@/stores/userStore';
import { NewList } from '@/interfaces/IList';

const route = useRoute();
const projectsStore = useProjectStore();
const listsStore = uselistStore();
const tasksStore = useTaskStore();
const userStore = useUserStore();

const project = ref<Project | null>(null);
const showAddListModal = ref(false);
const newListName = ref('');
const presentation = ref<'kanban' | 'trello'>('trello'); // Default view is 'trello'

const fetchProjectDetails = async (projectId: string) => {
  project.value = await projectsStore.fetchProjectById(projectId);

  if (project.value?.lists && project.value.lists.length > 0) {
    await listsStore.fetchLists(projectId);
    await Promise.all(listsStore.lists.map(list => tasksStore.fetchTasks(list._id)));
  }
};

const projectId = computed(() => route.params.id.toString());

watch(presentation, async (newValue) => {
  if (newValue === 'trello') {
    await fetchTrello();
  } else {
    await fetchKanban();
  }
});

async function fetchTrello() {
  await fetchProjectDetails(projectId.value);
}

async function fetchKanban() {
  await tasksStore.fetchTasksByProject(projectId.value);
}

onMounted(async () => {
    await userStore.fetchAllUsers();
    await fetchTrello();
});

onUnmounted(() => {
  project.value = null;
  listsStore.lists = [];
  tasksStore.tasksByListId = {};
});

const isLeader = computed(() => {
  return project.value?.teamMembers.some(member => member._id === userStore.user?._id && member.role === 'leader') || userStore.user?.role === 'admin';
});

const addList = async () => {
  if (newListName.value.trim() === '') return;
  const newList: NewList = {
    name: newListName.value,
    projectId: project.value?._id || '',
    tasks: [],
  };
  await listsStore.createList(newList);
  showAddListModal.value = false;
  newListName.value = '';
};

const togglePresentation = () => {
  presentation.value = presentation.value === 'kanban' ? 'trello' : 'kanban';
};
</script>

<style scoped>
/* Add your styles here */
</style>
