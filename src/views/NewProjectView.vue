<template>
   <div v-if="isLoading">Loading...</div>
   <!-- StepsIndicator component displays the progress steps based on the projectStatus -->
  <StepsIndicator :steps="['Setup', 'Tasks', 'Management']" :indicator="creationStatus"/>

  <!-- Conditional rendering of components based on the projectStatus -->
  <NewProjectSetup v-if="creationStatus=='setup'" @update-status="updateProjectStatus"/>
  <NewProjectTasks v-if="creationStatus=='tasks'" :projectId="projectId" @update-status="updateProjectStatus"/>
  <NewProjectManagement v-if="creationStatus=='management'" :projectId="projectId" @update-status="updateProjectStatus"/>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useProjectStore } from '@/stores/projectStore';
import { User } from '@/interfaces/IUser'; 
import { Project } from '@/interfaces/IProject'; 
import { TeamMember } from '@/interfaces/ITeamMember';
import NewProjectSetup from '@/components/NewProjectSetup.vue';
import NewProjectTasks from '@/components/NewProjectTasks.vue';
import NewProjectManagement from '@/components/NewProjectManagement.vue';
import StepsIndicator from '@/components/StepIndicator.vue';
import router from '@/router';

const userStore = useUserStore();
const projectStore = useProjectStore();

const users = ref<User[]>([]);


const roles = ref<Record<string, string>>({});

const creationStatus = ref<string>('setup');
const projectId = ref<string>();

const isLoading = ref<boolean>(true);
const errorMessage = ref<string | null>(null);


// Fetch users and initialize roles on component mount
onMounted(async () => {
  try{
    await userStore.fetchAllUsers();
  users.value = userStore.getUsers;
  users.value.forEach(user => roles.value[user._id] = 'member'); // Default to 'member'
  creationStatus.value = router.currentRoute.value.query.creationStatus as string || 'setup';
  projectId.value = router.currentRoute.value.query.projectId as string || undefined;

  }
  catch(error){
    console.error('Error fetching users:', error);
  } finally {
    isLoading.value = false;
  }
 
});

// Update project status
const updateProjectStatus = (status: string) => {
  creationStatus.value = status;
};
</script>
