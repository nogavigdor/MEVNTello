<template>
    <div class="p-8">
      <h1 class="text-2xl font-bold text-primary mb-4">Create New Project</h1>
      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <label for="projectName" class="block text-sm font-medium text-gray-700">Project Name</label>
          <input type="text" id="projectName" v-model="form.name" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
        </div>
        <div class="mb-4">
          <label for="projectDescription" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea id="projectDescription" v-model="form.description" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"></textarea>
        </div>
        <div class="mb-4">
          <label for="allocatedHours" class="block text-sm font-medium text-gray-700">Allocated Hours</label>
          <input type="number" id="allocatedHours" v-model.number="form.allocatedHours" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
        </div>
        <div class="mb-4">
          <label for="startDate" class="block text-sm font-medium text-gray-700">Start Date</label>
          <input type="date" id="startDate" v-model="form.startDate" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
        </div>
        <div class="mb-4">
          <label for="endDate" class="block text-sm font-medium text-gray-700">End Date</label>
          <input type="date" id="endDate" v-model="form.endDate" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
        </div>
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Assign Team Members and Roles</label>
            <div v-for="user in users" :key="user._id" class="flex items-center space-x-3 mb-2">
                <input type="checkbox" v-model="form.teamMembers" :value="{ userId: user._id, role: 'member' }">
                <span>{{ user.username }}</span>
                <select v-model="user.role">
                <option value="member">Member</option>
                <option value="leader">Leader</option>
                </select>
            </div>
            </div>
        <button type="submit" class="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded">
          Create Project
        </button>
      </form>
    </div>
  </template>
  
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useUserStore } from '@/stores/userStore';
  import { useProjectStore } from '@/stores/projectStore';
  
  const userStore = useUserStore();
  const projectStore = useProjectStore();
  const users = ref(userStore.getUsers); 
  
  const form = ref({
    name: '',
    description: '',
    teamMembers: [],
    startDate: '',
    endDate: '',
    allocatedHours: 0
  });

  onMounted(() => {
  // Fetch users if not already loaded
  if (users.value.length === 0) {
    userStore.fetchAllUsers().then(() => {
      users.value = userStore.getUsers;
    });
  }
});
  
  const submitForm = async () => {
    // Convert start date and end date to Date objects
    try {
        const projectData = {
      ...form.value,
      startDate: new Date(form.value.startDate),
      endDate: new Date(form.value.endDate),
      teamMembers: form.teamMembers?.map(tm => ({
      userId: tm._id,
      role: tm.role
    }))
    };
      await projectStore.createProject(projectData);
      alert('Project created successfully!');
     
    } catch (error) {
      alert('Failed to create project');
      console.error(error);
    }
  };
  </script>
  