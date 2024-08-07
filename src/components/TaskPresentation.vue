<template>
    <div class="bg-white rounded-lg p-4 shadow-md">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-lg font-medium">{{ task.name }}</h3>
        <div v-if="isLeader || isTaskMember(task)" class="space-x-2">
          <button class="text-blue-500 hover:text-blue-700" @click="editTask(task._id)">✏️</button>
          <button v-if="isLeader" class="text-red-500 hover:text-red-700" @click="deleteTask(task._id)">🗑️</button>
        </div>
      </div>
      <div class="flex mb-2">
          <label class="inline-flex items-center mr-4">
            <input type="radio" v-model="task.status" value="todo" class="form-radio" @change="updateTaskStatus(task)" />
            <span class="ml-2">To Do</span>
          </label>
          <label class="inline-flex items-center mr-4">
            <input type="radio" v-model="task.status" value="inProgress" class="form-radio" @change="updateTaskStatus(task)" />
            <span class="ml-2">In Progress</span>
          </label>
          <label class="inline-flex items-center">
            <input type="radio" v-model="task.status" value="done" class="form-radio" @change="updateTaskStatus(task)" />
            <span class="ml-2">Done</span>
          </label>
        </div>
      <p class="mb-2">Allocated Hours: {{ task.hoursAllocated }}</p>
      <div v-for="member in task.assignedMembers" :key="member._id" class="mb-2">
      <p class="mb-2">{{ member.username }}'s Used Hours: 
        <span v-if="isLeader || isTaskMember(task)">
          <input type="number" v-model="member.usedHours" class="border rounded px-2 py-1 w-full" @input="onMemberInputChange(member._id, member.usedHours)" />
        </span>
        <span v-else>{{ member.usedHours }}</span>
      </p>
      <progress :value="memberProgress(member)" max="100" class="w-full"></progress>
    </div>
    <div class="mb-2">
      <label for="progress">Total Progress: {{ totalUsedHours }} / {{ task.hoursAllocated }} hours</label>
      <progress id="progress" :value="totalProgress" max="100" class="w-full"></progress>
    </div>

    <!-- Edit Task Modal -->
    <EditTaskModal
      v-if="showEditModal"
      :task="task"
      :projectTeamMembers="projectTeamMembers"
      buttonText="Edit Task"
      modalTitle="Edit Task"
      @onSave="updateTask"
      @close="showEditModal = false"
    />
  </div>
  </template>
  
  <script setup lang="ts">
  import { computed, defineProps } from 'vue';
  import { ref } from 'vue';
  import { useTaskStore } from '@/stores/taskStore';
  import { useUserStore } from '@/stores/userStore';
  import { Task } from '@/interfaces/ITask';
  import { Project } from '@/interfaces/IProject';
  import { useProjectStore } from '@/stores/projectStore';
  import { AssignedMember } from '@/interfaces/IAssignedMember';
  //handles the debouncing of the input field
  import { debounce} from 'lodash';
  import EditTaskModal from './EditTaskModal.vue';
  import { TeamMember } from '@/interfaces/ITeamMember';
  
  const props = defineProps<{ task: Task, projectId: string, isLeader: boolean, projectTeamMembers: TeamMember[] }>();
  
  const tasksStore = useTaskStore();
  const userStore = useUserStore();
  const projectStore = useProjectStore();

  const inputHoursUsed = ref(props.task.hoursUsed);
  
  const project = computed<Project | undefined>(() => projectStore.getProjectById(props.projectId));
  
  const showEditModal = ref(false);
  
  const isTaskMember = (task: Task) => {
    return task.assignedMembers.some(member => member._id === userStore.user?._id);
  };
  
  const updateTask = async (updatedTask: Task) => {
  await tasksStore.updateTask(updatedTask._id, updatedTask);
  showEditModal.value = false;
};
  
const updateMemberUsedHours = debounce(async (memberId: string, usedHours: number) => {
  await tasksStore.updateMemberUsedHours(props.task._id, memberId, usedHours);
}, 300);

  const deleteTask = async (taskId: string) => {
    await tasksStore.deleteTask(taskId);
  
  };

const onMemberInputChange = (memberId: string, usedHours: number) => {
  updateMemberUsedHours(memberId, usedHours);
};

const memberProgress = (member: AssignedMember) => {
  return Math.min((member.usedHours / props.task.hoursAllocated) * 100, 100);
};

const totalUsedHours = computed(() => {
  return props.task.assignedMembers.reduce((acc, member) => acc + member.usedHours, 0);
});

const totalProgress = computed(() => {
  //in casa the hours allocated are 0, we return 0 to avoid division by 0
  return props.task.hoursAllocated > 0 
  ? Math.min((totalUsedHours.value / props.task.hoursAllocated) * 100, 100)
  :0;
});
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  