<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold text-primary mb-4">Create New Project</h1>
    <form @submit.prevent="submitForm">
      <!-- Project name input -->
      <div class="mb-4">
        <label for="projectName" class="block text-sm font-medium text-gray-700">Project Name</label>
        <input type="text" id="projectName" v-model="form.name" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
      </div>

      <!-- Project description input -->
      <div class="mb-4">
        <label for="projectDescription" class="block text-sm font-medium text-gray-700">Description</label>
        <textarea id="projectDescription" v-model="form.description" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"></textarea>
      </div>

      <!-- Allocated hours input -->
      <div class="mb-4">
        <label for="allocatedHours" class="block text-sm font-medium text-gray-700">Allocated Hours</label>
        <input type="number" id="allocatedHours" v-model.number="form.allocatedHours" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
      </div>

      <!-- Start date input -->
      <div class="mb-4">
        <label for="startDate" class="block text-sm font-medium text-gray-700">Start Date</label>
        <input type="date" id="startDate" v-model="form.startDate" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
      </div>

      <!-- End date input -->
      <div class="mb-4">
        <label for="endDate" class="block text-sm font-medium text-gray-700">End Date</label>
        <input type="date" id="endDate" v-model="form.endDate" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
      </div>

      <!-- Dynamic team member assignment with role selection -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Assign Team Members and Roles</label>
        <div v-for="user in users" :key="user.userId" class="flex items-center space-x-3 mb-2">
          <input type="checkbox" v-model="selectedTeamMembers" :value="user.userId">
          <span>{{ user.username }}</span>
          <select v-model="roles[user.userId]">
            <option value="member">Member</option>
            <option value="leader">Leader</option>
          </select>
        </div>
      </div>

      <button type="submit" class="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded">Create Project</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useProjectStore } from '@/stores/projectStore';
import { User } from '@/interfaces/IUser'; 
import { Project } from '@/interfaces/IProject'; 
import { TeamMember } from '@/interfaces/ITeamMember';

const userStore = useUserStore();
const projectStore = useProjectStore();


const users = ref<User[]>([]);

// Setup reactive form data and roles state
const form = reactive<Project>({
  name: '',
  description: '',
  startDate: new Date(),
  endDate: new Date(),
  allocatedHours: 0,
  teamMembers: []
});
const roles = reactive<Record<string, string>>({});
const selectedTeamMembers = ref<string[]>([]);

// Fetch users and initialize roles on component mount
onMounted(async () => {
  await userStore.fetchAllUsers();
  users.value = userStore.getUsers;
  users.value.forEach(user => roles[user.userId] = 'member'); // Default to 'member'
});

// Submit form data including dynamic role assignments
const submitForm = async () => {
  const projectData: Project = {
    ...form,
    startDate: new Date(form.startDate),
    endDate: new Date(form.endDate),
    teamMembers: selectedTeamMembers.value.map(userId => ({
      userId,
      role: roles[userId] as "member" | "leader"
    }))
  };
  try {
    await projectStore.createProject(projectData);
    alert('Project created successfully!');
  } catch (error) {
   alert('Failed to create project');
    console.error(error);
  }
};
</script>
