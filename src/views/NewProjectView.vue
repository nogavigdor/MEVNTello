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


const roles = ref<Record<string, string>>({});
const selectedTeamMembers = ref<string[]>([]);

//before mount


// Fetch users and initialize roles on component mount
onMounted(async () => {
  await userStore.fetchAllUsers();
  users.value = userStore.getUsers;
  users.value.forEach(user => roles.value[user._id] = 'member'); // Default to 'member'
});

</script>
