<template>
  <StepsIndicator :steps="['Setup', 'Tasks', 'Management']" />
 <NewProjectSetup />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useProjectStore } from '@/stores/projectStore';
import { User } from '@/interfaces/IUser'; 
import { Project } from '@/interfaces/IProject'; 
import { TeamMember } from '@/interfaces/ITeamMember';
import NewProjectSetup from '@/components/NewProjectSetup.vue';
import StepsIndicator from '@/components/StepIndicator.vue';

const userStore = useUserStore();
const projectStore = useProjectStore();

const users = ref<User[]>([]);

// Setup ref data for form and roles
const form = ref<Project>({
  name: '',
  description: '',
  creator: userStore.user?._id as string,
  startDate: new Date(new Date().toISOString().split('T')[0]), // Initialize with today's date in YYYY-MM-DD format
  endDate: new Date(new Date().toISOString().split('T')[0]), // Initialize with today's date in YYYY-MM-DD format
  allocatedHours: 0,
  teamMembers: []
});

const roles = ref<Record<string, string>>({});
const selectedTeamMembers = ref<string[]>([]);

// Fetch users and initialize roles on component mount
onMounted(async () => {
  await userStore.fetchAllUsers();
  users.value = userStore.getUsers;
  users.value.forEach(user => roles.value[user._id] = 'member'); // Default to 'member'
});

// Handle checkbox change event
const handleCheckboxChange = (event: Event, _id: string) => {
  const checkbox = event.target as HTMLInputElement;
  if (checkbox.checked) {
    selectedTeamMembers.value.push(_id);
  } else {
    selectedTeamMembers.value = selectedTeamMembers.value.filter(id => id !== _id);
  }
};



// Submit form data including dynamic role assignments
const submitForm = async () => {
  const projectData: Project = {
    ...form.value,
    //overides default form values with the form input values
    startDate: new Date(form.value.startDate),
    endDate: new Date(form.value.endDate),
    teamMembers: selectedTeamMembers.value.map(_id => ({
   
      role: roles.value[_id] as "member" | "leader"
    })),
    lists: []

  };

  console.log('Project Data:', projectData); // Log the data to verify structure
  console.log('Selected Team Members:', selectedTeamMembers.value);
  console.log('Roles:', roles.value);


  try {
    await projectStore.createProject(projectData);
    alert('Project created successfully!');
  } catch (error) {
    alert('Failed to create project');
    console.error(error);
  }
};
</script>
