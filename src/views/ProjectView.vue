<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-4">{{ project?.name }}</h1>
    <p class="mb-6">{{ project?.description }}</p>
    <p>You have a <span>{{ isLeader ? 'leader' : 'member' }}</span> role in this project</p>
    <div class="flex space-x-4 overflow-x-auto" v-if="listsStore.lists.length > 0">
      <ListItem v-for="list in listsStore.lists" :key="list._id" :list="list" :projectId="project?._id ?? ''" />
    </div>
    <div v-else>
      <p>No lists available for this project.</p>
    </div>
    <div v-if="isLeader">
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
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useProjectStore } from '@/stores/projectStore';
import { useListStore } from '@/stores/listStore';
import { useTaskStore } from '@/stores/taskStore';
import { Project } from '@/interfaces/IProject';
import { List, NewList } from '@/interfaces/IList';
import { Task, NewTask } from '@/interfaces/ITask';
import { TeamMember } from '@/interfaces/ITeamMember';
import { useUserStore } from '@/stores/userStore';
import ListItem from '@/components/ListItem.vue'; // Adjust the path accordingly

const route = useRoute();
const projectsStore = useProjectStore();
const listsStore = useListStore();
const tasksStore = useTaskStore();
const userStore = useUserStore();

const project = ref<Project | null>(null);
const showAddListModal = ref(false);
const newListName = ref('');

const fetchProjectDetails = async (projectId: string) => {
  project.value = await projectsStore.fetchProjectById(projectId);

  if (project.value?.lists && project.value.lists.length > 0) {
    await listsStore.fetchLists(projectId);
    await Promise.all(listsStore.lists.map(list => tasksStore.fetchTasks(list._id)));
  }
};

onMounted(async () => {
  const projectId = route.params.id.toString();
  await fetchProjectDetails(projectId);
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
</script>

<style scoped>

</style>
