<template>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="p-4 bg-white rounded-lg shadow flex items-center">
        <font-awesome-icon :icon="icons.todo" class="text-purple-500 mr-2" />
        <p class="text-gray-900">
          Todo Projects: <span class="font-bold">{{ todoProjects }}</span> / {{ totalProjects }}
        </p>
      </div>
      <div class="p-4 bg-white rounded-lg shadow flex items-center">
        <font-awesome-icon :icon="icons.inProgress" class="text-yellow-500 mr-2" />
        <p class="text-gray-900">
          In Progress Projects: <span class="font-bold">{{ inProgressProjects }}</span> / {{ totalProjects }}
        </p>
      </div>
      <div class="p-4 bg-white rounded-lg shadow flex items-center">
        <font-awesome-icon :icon="icons.overdue" class="text-red-500 mr-2" />
        <p class="text-gray-900">
          Overdue Projects: <span class="font-bold">{{ overdueProjects }}</span> / {{ totalProjects }}
        </p>
      </div>
      <div class="p-4 bg-white rounded-lg shadow flex items-center">
        <font-awesome-icon :icon="icons.completed" class="text-green-500 mr-2" />
        <p class="text-gray-900">
          Completed Projects: <span class="font-bold">{{ completedProjects }}</span> / {{ totalProjects }}
        </p>
      </div>
    </div>
  </template>

<script setup lang="ts">
import { ref, computed, defineProps, onMounted } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCheckCircle, faExclamationCircle, faHourglassHalf, faCircle } from '@fortawesome/free-solid-svg-icons';
import { useTaskStore } from '@/stores/taskStore';

const props = defineProps<{ projects: any[] }>();

const taskStore = useTaskStore();

// Register icons
const icons = {
  todo: faCircle,
  inProgress: faHourglassHalf,
  overdue: faExclamationCircle,
  completed: faCheckCircle,
};

// Calculate total number of projects
const totalProjects = computed(() => props.projects.length);

const todoProjects = ref(0);
const inProgressProjects = ref(0);
const overdueProjects = ref(0);
const completedProjects = ref(0);

const determineProjectStatus = async (projectId: string) => {
  await taskStore.fetchTasksByProject(projectId);
  const projectTasks = taskStore.tasks;

  if (projectTasks.length === 0) {
    todoProjects.value += 1;
  } else {
    const completed = projectTasks.filter(task => task.status === 'done').length;
    const total = projectTasks.length;
    const now = new Date();
    const projectEndDate = props.projects.find(p => p._id === projectId)?.endDate;

    if (completed === total) {
      completedProjects.value += 1;
    } else if (new Date(projectEndDate) < now && completed !== total) {
      overdueProjects.value += 1;
    } else {
      inProgressProjects.value += 1;
    }
  }
};

onMounted(async () => {
  for (const project of props.projects) {
    await determineProjectStatus(project._id);
  }
});
</script>
