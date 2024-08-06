<template>
   <div v-if="isLoading">Loading...</div>
   <!-- StepsIndicator component displays the progress steps based on the projectStatus -->
  <StepsIndicator :steps="['Setup', 'Tasks', 'Management']" :indicator="creationStatus"/>

  <!-- Conditional rendering of components based on the projectStatus -->
  <NewProjectSetup v-if="creationStatus=='setup'"/>
  <NewProjectTasks v-if="creationStatus=='tasks'" :projectId="projectId"/>
  <NewProjectManagement v-if="creationStatus=='management'" :projectId="projectId" />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
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
import { useRoute } from 'vue-router';

const userStore = useUserStore();
const projectStore = useProjectStore();

const route = useRoute();

const users = ref<User[]>([]);


const roles = ref<Record<string, string>>({});

const projectId = ref<string>("");
const creationStatus = computed(() => projectStore.getProjectById(projectId.value)?.creationStatus as string || 'setup');


const isLoading = ref<boolean>(true);
const errorMessage = ref<string | null>(null);

watch(
  () => route.query.projectId, async (newProjectId) => {
  projectId.value = newProjectId as string || "";
});


// Fetch users and initialize roles on component mount
onMounted(async () => {
  try{
    await userStore.fetchAllUsers();
  users.value = userStore.getUsers;
  users.value.forEach(user => roles.value[user._id] = 'member'); // Default to 'member'
  projectId.value = router.currentRoute.value.query.projectId as string || "";
    console.log("projectId", projectId.value);
  }
  catch(error){
    console.error('Error fetching users:', error);
  } finally {
    isLoading.value = false;
  }

  if (projectId.value) {
    await projectStore.fetchProjectById(projectId.value);
  }
 
});

</script>
