<template>
    <li class="p-4 bg-white rounded-lg shadow">
    <div class="flex justify-between items-center">
      <div>
        <router-link :to="`/projects/${project._id}`" class="text-lg font-medium text-primary hover:underline">
          {{ project.name }}
        </router-link>
        <p>{{ project.description }}</p>
        <div class="flex space-x-2 mt-2">
          <span v-for="member in project.teamMembers" :key="member._id" class="text-sm">
            {{ getUsername(member._id) }} <span v-if="member.role === 'leader'" class="text-primary">: Leader</span>
            <span v-else class="text-secondary">(Member)</span>
          </span>
        </div>
      </div>
      <div class="flex space-x-4">
        <p :class="{'text-red-500': isOverdue}">{{ formatDate(project.endDate) }}</p>
        <StatusIcon :status="getProjectStatus" /> <span>{{ getProjectStatus }}</span>
      </div>
      <button @click="toggleDetails">
        <font-awesome-icon :icon="iconClass" />
      </button>
    </div>
    <transition name="slide-fade">
      <div v-if="showDetails" class="mt-4">
        <div class="grid grid-cols-3 gap-4">
          <div>
            <p>Tasks: {{ completedTasks }} / {{ totalTasks }}</p>
          </div>
          <div>
            <p>Hours: {{ getUsedHours }} / {{ project.allocatedHours }}</p>
            <progress :value="getUsedHours" :max="project.allocatedHours"></progress>
          </div>
          <div>
            <AdminOptions v-if="isAdminOrLeader" :projectId="project._id" />
          </div>
        </div>
      </div>
    </transition>
  </li>
</template>
<script setup lang="ts">
import { onMounted, ref, computed, watch, defineProps} from 'vue';
import { useProjectStore } from '@/stores/projectStore';
import { useUserStore } from '@/stores/userStore';
import { useTaskStore } from '@/stores/taskStore';
import { formatDate } from '@/utils/date';
import StatusIcon from '@/components/StatusIcon.vue';
import AdminOptions from '@/components/AdminOptions.vue';
import { Project } from '@/interfaces/IProject';
import { Task } from '@/interfaces/ITask';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const props = defineProps(["project"]);

const showDetails = ref(false);

const toggleDetails = () => {
  showDetails.value = !showDetails.value;
};

const iconClass = computed(() => {
  return showDetails.value ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
});


const projectStore = useProjectStore();
const userStore = useUserStore();
const taskStore = useTaskStore();

const isAdminOrLeader = computed(() => userStore.user?.role === 'admin' || props.project.role === 'leader');

const projectTasks = ref<Task[]>([]);


// Fetch tasks for the current user’s projects
const fetchTasksForByProject = async () => {
  if (props.project._id) {
    const fetchedTasks = await taskStore.fetchTasksByProject(props.project._id);
    console.log ('The fetched Tasks on Monunt are:', fetchedTasks);
    projectTasks.value = fetchedTasks ?? [];
  }
};

const getUsername = computed(() => {
  return (userId: string) => {
    const user = userStore.getUserById(userId);
    console.log('The user is:', user);
    return user?.username;
  };
});

onMounted( async () => {
  await fetchTasksForByProject();
  await userStore.fetchAllUsers();
});

const getProjectStatus = computed(() => {
  if (totalTasks.value === 0) {
    return 'todo';
  } else if (completedTasks.value === totalTasks.value) {
    return 'Completed';
  } if (isOverdue.value) {
    return 'overdue';
  } else {
    return 'inProgress';
  }
});

const completedTasks = computed(() => {
  return projectTasks.value.filter(task => task.status === 'done').length;
});

const totalTasks = computed(() => {
  return projectTasks.value.length;
});

const getUsedHours = computed(() => {
  return projectTasks.value.reduce((acc, task) => acc + task.hoursUsed, 0);
});

const isOverdue = computed(() => {
  return new Date(props.project.endDate) < new Date();
});




</script>
