<template>
    <div class="bg-gray-100 rounded-lg p-4 w-80">
      {{ isLeader }}
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">{{ list.name }}</h2>
        <div v-if="isLeader" class="space-x-2">
          <button class="text-blue-500 hover:text-blue-700" @click="editList(list._id)">✏️</button>
          <button class="text-red-500 hover:text-red-700" @click="deleteList(list._id)">🗑️</button>
        </div>
      </div>
      <TaskItem v-for="task in tasksStore.tasksByListId[list._id]" :key="task._id" :task="task" :projectId="props.projectId" />
      <button v-if="isLeader" class="bg-green-500 text-white p-2 rounded mt-4" @click="showAddTaskModal = true">Add Task</button>
      <div v-if="showAddTaskModal" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
        <div class="bg-white p-6 rounded shadow-lg w-96">
          <h2 class="text-xl font-bold mb-4" v-if="isLeader">Add New Task</h2>
          <input v-model="newTask.name" class="border rounded w-full p-2 mb-4" placeholder="Task Name" />
          <input v-model="newTask.description" class="border rounded w-full p-2 mb-4" placeholder="Task Description" />
          <input v-model="newTask.hoursAllocated" type="number" class="border rounded w-full p-2 mb-4" placeholder="Hours Allocated" />
          <label class="block mb-2">Assign Members</label>
          <select v-model="selectedMembers" multiple class="border rounded w-full p-2 mb-4">
            <option v-for="member in projectTeamMembers" :key="member._id" :value="member._id">{{ getMemberName(member._id) }}</option>
          </select>
          <div class="flex justify-end space-x-2">
            <button class="bg-gray-500 text-white p-2 rounded" @click="showAddTaskModal = false">Cancel</button>
            <button class="bg-blue-500 text-white p-2 rounded" @click="addTask">Add</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, defineProps } from 'vue';
  import { useTaskStore } from '@/stores/taskStore';
  import { useListStore } from '@/stores/listStore';
  import { useUserStore } from '@/stores/userStore';
  import { useProjectStore } from '@/stores/projectStore';
  import TaskItem from './TaskItem.vue';
  import { List } from '@/interfaces/IList';
  import { NewTask } from '@/interfaces/ITask';
  import { User } from '@/interfaces/IUser';
  
  const props = defineProps<{ list: List, projectId: string, isLeader: boolean }>();

  const tasksStore = useTaskStore();
  const listsStore = useListStore();
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
  
  const editList = (listId: string) => {
    currentList = listsStore.lists.find(list => list._id === listId);
  };
  
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
      return member ? { _id: member._id, username: getMemberName(member._id), role: member.role } : { _id: id, username: 'Unknown', role: 'member' };
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
  