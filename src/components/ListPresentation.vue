<template>
    <div class="bg-gray-100 rounded-lg p-4 w-80">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">
         <input v-model="list.name" @change="updateListName" v-if="isAdmin || isLeader" />
         <span v-else>{{ list.name }}</span>
        </h2>
        <div v-if="isLeader" class="space-x-2">
          <button class="text-red-500 hover:text-red-700" @click="deleteList(list._id)"><font-awesome-icon icon="trash" class="text-red-500 hover:text-red-700" /></button>
        </div>
      </div>
      <TaskPresentation v-for="task in tasksStore.tasksByListId[list._id]" :key="task._id" :task="task" :projectId="props.projectId" :projectTeamMembers="projectTeamMembers" :isLeader="isLeader" />
      <AddTaskModal :listId="list._id" :projectTeamMembers="projectTeamMembers" v-if="isLeader" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, defineProps } from 'vue';
  import { useTaskStore } from '@/stores/taskStore';
  import { uselistStore } from '@/stores/listStore';
  import { useUserStore } from '@/stores/userStore';
  import { useProjectStore } from '@/stores/projectStore';
  import TaskPresentation from './TaskPresentation.vue';
  import { List } from '@/interfaces/IList';
  import { NewTask } from '@/interfaces/ITask';
  import { User } from '@/interfaces/IUser';
  import AddTaskModal from './AddTaskModal.vue';
  import { library } from '@fortawesome/fontawesome-svg-core';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import { faTrash } from '@fortawesome/free-solid-svg-icons';
  import { debounce} from 'lodash';
  
  const props = defineProps<{ list: List, projectId: string, isLeader: boolean }>();

  const tasksStore = useTaskStore();
  const listsStore = uselistStore();
  const userStore = useUserStore();
  const projectStore = useProjectStore();
  const showAddTaskModal = ref(false);
  const selectedMembers = ref<string[]>([]);
  const newTask = ref<NewTask>({
    name: '',
    description: '',
    hoursAllocated: 0,
    hoursUsed: 0,
    status: 'todo',
    assignedMembers: [],
    listId: props.list._id,
    subTasks: []
  });

  const isAdmin = computed(() => userStore.isAdmin);
  
  const project = computed(() => projectStore.getProjectById(props.projectId));
  const projectTeamMembers = computed(() => project.value?.teamMembers || []);
  
  // Helper function to get member name
  const getMemberName = (memberId: string) => {
    const member = userStore.users.find((user: User) => user._id === memberId);
    return member ? member.username : 'Unknown';
  };
  
  // const isLeader = computed(() => {
  //  return project.value?.teamMembers.some(member => member._id === userStore.user?._id && member.role === 'leader') || userStore.user?.role === 'admin';
  //});

  const updateListName = debounce(async () => {
    listsStore.updateList({ _id: props.list._id, name: props.list.name });
  }, 300);
  
  const deleteList = async (listId: string) => {
    await listsStore.deleteList(listId); // Ensure this function is correctly imported from your store
    // Additional logic if needed
  };
  
  const addTask = async () => {
    if (selectedMembers.value.length === 0) {
      alert('Please assign at least one member to the task.');
      return;
    }
    // Map selected member IDs to TeamMember objects
    newTask.value.assignedMembers = selectedMembers.value.map(id => {
      const member = projectTeamMembers.value.find(m => m._id === id);
      return member
      ? { _id: member._id ?? '', username: getMemberName(member._id ?? ''), role: member.role, usedHours:0, allocatedHours:0 }
        : { _id: id, username: 'Unknown', role: 'member', usedHours:0, allocatedHours:0  };
    });
    await tasksStore.createTask(props.list._id, newTask.value);
    showAddTaskModal.value = false;
    newTask.value = {
      name: '',
      description: '',
      hoursAllocated: 0,
      hoursUsed: 0,
      status: 'todo',
      assignedMembers: [],
      listId: props.list._id,
      subTasks: []
    };
    selectedMembers.value = [];
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  