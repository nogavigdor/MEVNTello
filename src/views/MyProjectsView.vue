<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-6">
      <h1  class="text-2xl font-bold text-primary">{{ isAdmin ? 'All Projects' : 'My Projects' }}</h1>
      <router-link
        to="/projects/new"
        class="bg-primary text-white px-4 py-2 rounded shadow hover:bg-primary-dark"
      >
        Add New Project
      </router-link>
    </div>
    <ul v-if="projects.length>0" class="space-y-4">
      <ProjectItem v-for="project in projects"
                   :key="project._id" :project="project" 
                   @project-deleted="removeProjectFromList" />
    </ul>
    <ul v-else>
      <p>No projects are found.</p>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import { useProjectStore } from '@/stores/projectStore';
import { useUserStore } from '@/stores/userStore';
//import { useTaskStore } from '@/stores/taskStore';
import { formatDate } from '@/utils/date';
import StatusIcon from '@/components/StatusIcon.vue';
import AdminOptions from '@/components/AdminOptions.vue';
import { Project } from '@/interfaces/IProject';
import { Task } from '@/interfaces/ITask';
import ProjectItem from '@/components/ProjectItem.vue';

// Extend the Project interface for use in this component
//interface ExtendedProject extends Project {
 // showDetails: boolean;
 // completedTasks?: number;
//}

// Initialize stores
const projectsStore = useProjectStore();
const userStore = useUserStore();
//const taskStore = useTaskStore();

// Directly get the current user ID from the user store
const userId = computed(() => userStore.user?._id);

const isAdmin = computed(() => userStore.isAdmin );

const user = computed(() => userStore.getUser)

// Reactive variable to hold projects with proper typing
const projects = ref<Project[]>([]);

// Function to fetch projects for the current user
const fetchProjects = async () => {
  if (userId.value) {
    const fetchedProjects = await projectsStore.fetchProjectByUserId(userId.value);
    projects.value = fetchedProjects.map((project) => ({ ...project, showDetails: false }));
  }
};

// Method to remove project from the list
const removeProjectFromList = (projectId: string) => {
  projects.value = projects.value.filter(project => project._id !== projectId);
};

// Fetch projects on component mount
onMounted(
  fetchProjects
);



</script>
<style scoped>
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
