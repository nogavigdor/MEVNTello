<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-primary">My Projects</h1>
      <button class="bg-primary text-white px-4 py-2 rounded shadow hover:bg-primary-dark">Add New Project</button>
    </div>
    <ul class="space-y-4">
      <ProjectItem v-for="project in projects" :key="project._id" :project="project" />
    </ul>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import { useProjectStore } from '@/stores/projectStore';
import { useUserStore } from '@/stores/userStore';
import { useTaskStore } from '@/stores/taskStore';
import { formatDate } from '@/utils/date';
import StatusIcon from '@/components/StatusIcon.vue';
import AdminOptions from '@/components/AdminOptions.vue';
import { Project } from '@/interfaces/IProject';
import { Task } from '@/interfaces/ITask';
import ProjectItem from '@/components/ProjectItem.vue';

// Extend the Project interface for use in this component
interface ExtendedProject extends Project {
  showDetails: boolean;
  completedTasks?: number;
}

// Initialize stores
const projectsStore = useProjectStore();
const userStore = useUserStore();
const taskStore = useTaskStore();

// Directly get the current user ID from the user store
const userId = computed(() => userStore.user?._id);

// Reactive variable to hold projects with proper typing
const projects = ref<ExtendedProject[]>([]);

// Function to fetch projects for the current user
const fetchProjects = async () => {
  if (userId.value) {
    const fetchedProjects = await projectsStore.fetchProjectByUserId(userId.value);
    projects.value = fetchedProjects.map((project) => ({ ...project, showDetails: false }));
  }
};

// Fetch projects on component mount
onMounted(fetchProjects);

console.log ('The fetched Projects on Monunt are:', projects.value);

// Reactive variable to hold project tasks with proper typing
const projectTasks = ref<Task[]>([]);

// Fetch tasks for the current user’s projects
const fetchTasksForProjects = async () => {
  if (userId.value) {
    const fetchedTasks = await taskStore.fetchTasksByProject(userId.value);
    console.log ('The fetched Tasks on Monunt are:', fetchedTasks);
    projectTasks.value = fetchedTasks;
  }
};

// Fetch tasks on component mount
onMounted(fetchTasksForProjects);

// Watch for changes in project tasks and update completed tasks
watch(projectTasks, (newTasks) => {
  projects.value.forEach((project) => {
    project.completedTasks = getCompletedTasks(project);
  });
}, { deep: true });

// Computed property to get all incomplete tasks
const incompleteTasks = computed(() => {
  return projectTasks.value.filter(task => task.status === 'todo' || task.status === 'inProgress');
});

// Utility functions
const isOverdue = (project: Project) => {
  const today = new Date();
  const dueDate = new Date(project.endDate);
  return dueDate < today;
};

const getProjectStatus = (project: Project) => {
  if (isOverdue(project)) return 'overdue';
  return 'ongoing';
};

const toggleDetails = (projectId: string) => {
  const project = projects.value.find((p) => p._id === projectId);
  if (project) {
    project.showDetails = !project.showDetails;
  }
};

const getCompletedTasks = (project: Project) => {
  return projectTasks.value.filter(task => task.status === 'done').length;
};

const getTotalTasks = (project: Project) => {
  return projectTasks.value.length;
};

const getUsedHours = (project: Project) => {
  return projectTasks.value.reduce((total, task) => total + task.hoursUsed, 0);
};

const isAdminOrLeader = (project: Project) => {
  const user = userStore.user;
  return user?.role === 'admin' || project.teamMembers.some(member => member._id === user?._id && member.role === 'leader');
};
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
