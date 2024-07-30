<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-4">{{ project?.name }}</h1>
    <p class="mb-6">{{ project?.description }}</p>
    <p>You have a <span>{{ isLeader ? 'leader' : 'member' }}</span> role in this project</p>
    <div class="flex space-x-4 overflow-x-auto" v-if="listsStore.lists.length > 0">
      <div class="bg-gray-100 rounded-lg p-4 w-80" v-for="list in listsStore.lists" :key="list._id">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">{{ list.name }}</h2>
          <div v-if="isLeader" class="space-x-2">
            <button class="text-blue-500 hover:text-blue-700" @click="editList(list._id)">✏️</button>
            <button class="text-red-500 hover:text-red-700" @click="deleteList(list._id)">🗑️</button>
          </div>
        </div>
        <div class="space-y-4" v-if="tasksStore.tasksByListId[list._id] && tasksStore.tasksByListId[list._id].length > 0">
          <div class="bg-white rounded-lg p-4 shadow-md" v-for="task in tasksStore.tasksByListId[list._id]" :key="task._id">
            <div class="flex justify-between items-center mb-2">
              <h3 class="text-lg font-medium">{{ task.name }}</h3>
              <div v-if="isLeader || isTaskMember(task)" class="space-x-2">
                <button class="text-blue-500 hover:text-blue-700" @click="editTask(task._id)">✏️</button>
                <button v-if="isLeader" class="text-red-500 hover:text-red-700" @click="deleteTask(task._id)">🗑️</button>
              </div>
            </div>
            <p class="mb-2">Allocated Hours: {{ task.hoursAllocated }}</p>
            <p class="mb-2">Used Hours: 
              <span v-if="isLeader || isTaskMember(task)">
                <input type="number" v-model="task.hoursUsed" class="border rounded px-2 py-1 w-full" @change="updateHoursUsed(task)" />
              </span>
              <span v-else>{{ task.hoursUsed }}</span>
            </p>
            <div class="flex flex-wrap space-x-2">
              <span class="bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700" v-for="member in task.assignedMembers" :key="member._id">{{ member.name }}</span>
            </div>
          </div>
        </div>
        <div v-else>
          <p>No tasks available for this list.</p>
        </div>
      </div>
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

const route = useRoute();
const projectsStore = useProjectStore();
const listsStore = useListStore();
const tasksStore = useTaskStore();
const userStore = useUserStore();

const project = ref<Project | null>(null);
const showAddListModal = ref(false);
const showAddTaskModal = ref(false);
const newListName = ref('');
const newTask = ref<NewTask>({
  name: '',
  hoursAllocated: 0,
  hoursUsed: 0,
  assignedMembers: [],
});

const fetchProjectDetails = async (projectId: string) => {
  project.value = await projectsStore.fetchProjectById(projectId);

  if (project.value?.lists && project.value.lists.length > 0) {
    await listsStore.fetchLists(projectId);

    // Fetch tasks for each list
    await Promise.all(listsStore.lists.map(async (list: List) => {
      await tasksStore.fetchTasks(list._id);
    }));
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

const isTaskMember = (task: Task) => {
  return task.assignedMembers.some(member => member._id === userStore.user?._id);
};

const editList = (listId: string) => {
  // Handle edit list
};

const deleteList = async (listId: string) => {
  await listsStore.deleteList(listId);
  project.value = await projectsStore.fetchProjectById(route.params.id.toString());
};

const addTask = async () => {
  const listId = 'listId'; // Replace with the actual list ID
  await tasksStore.createTask(listId, newTask.value);
};

const editTask = (taskId: string) => {
  // Handle edit task
};

const deleteTask = async (taskId: string) => {
  await tasksStore.deleteTask(taskId);
  project.value = await projectsStore.fetchProjectById(route.params.id.toString());
};

const updateHoursUsed = async (task: Task) => {
  await tasksStore.updateTask(task._id, { hoursUsed: task.hoursUsed });
  project.value = await projectsStore.fetchProjectById(route.params.id.toString());
};

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
