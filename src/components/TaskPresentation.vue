<template>
    <div class="bg-white rounded-lg p-4 shadow-md">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-lg font-medium">{{ !isAdmin&&!isLeader? task.name:'' }}</h3>
        <input v-model="task.name" @change="updateTask({ name: task.name })" v-if="isAdmin || isLeader" />
        <div v-if="isLeader || isTaskMember(task)" class="space-x-2">
          <button v-if="isLeader" class="text-red-500 hover:text-red-700" @click="deleteTask(task._id)">🗑️</button>
        </div>
      </div>
      <div class="flex mb-2">
          <label class="inline-flex items-center mr-4">
            <input type="radio" v-model="task.status" value="todo" class="form-radio" @change="updateTask({ status: task.status })" />
            <span class="ml-2">To Do</span>
          </label>
          <label class="inline-flex items-center mr-4">
            <input type="radio" v-model="task.status" value="inProgress" class="form-radio" @change="updateTask({ status: task.status})" />
            <span class="ml-2">In Progress</span>
          </label>
          <label class="inline-flex items-center">
            <input type="radio" v-model="task.status" value="done" class="form-radio" @change="updateTask({ status: task.status})" />
            <span class="ml-2">Done</span>
          </label>
        </div>
      <p class="mb-2">Allocated Hours: <input v-if="isAdmin || isLeader" v-model="task.hoursAllocated" @change="allocatedHours" type="number" /> <span v-else >{{ task.hoursAllocated }}</span></p>
      <div v-if="(isAdmin || isLeader) && task.assignedMembers.length === 0" class="mb-2">
        <AssignMembers v-model="selectedMembers" :projectTeamMembers="projectTeamMembers" />
        <button @click="assignMembers">Assign Members</button>
      </div>
      <div v-for="member in task.assignedMembers" :key="member._id" class="mb-2">
      <p class="mb-2">{{ member.username }}'s Used Hours: 
        <span v-if="amImemberInTask(member)">
          <input type="number" v-model="member.usedHours" class="border rounded px-2 py-1 w-full" @input="onMemberInputChange(member._id ?? '', member.usedHours)" />
        </span>
        <span v-else>{{ member.usedHours }}</span>
      </p>
      <progress :value="memberProgress(member)" max="100" class="w-full"></progress>
    </div>
    <div class="mb-2">
      <label for="progress">Total Progress: {{ totalUsedHours }} / {{ task.hoursAllocated }} hours</label>
      <progress id="progress" :value="totalProgress" max="100" class="w-full"></progress>
    </div>
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
  import { assign, debounce} from 'lodash';
  import EditTaskModal from './EditTaskModal.vue';
  import { TeamMember } from '@/interfaces/ITeamMember';
  import AssignMembers from './AssignMembers.vue';
import { getMemberName } from '@/utils/getMemberName';
  
  const props = defineProps<{ task: Task, projectId: string, isLeader: boolean, projectTeamMembers: TeamMember[] }>();
  
  const tasksStore = useTaskStore();
  const userStore = useUserStore();
  const projectStore = useProjectStore();

  const isAdmin = computed(() => userStore.user?.role === 'admin');

  const inputHoursUsed = ref(props.task.hoursUsed);
  
  const project = computed<Project | undefined>(() => projectStore.getProjectById(props.projectId));

  const showEditModal = ref(false);

  const selectedMembers = ref<string[]>([]);
  
  const isTaskMember = (task: Task) => {
    return props.task.assignedMembers.some(member => member._id === userStore.user?._id);
  };

  const assignMembers = async () => {
    const assignedMembers: AssignedMember[] = selectedMembers.value.map(memberId => {
      const member = props.projectTeamMembers.find(member => member._id === memberId);
      return member ? { _id: member._id, username: getMemberName(memberId), role: member.role, usedHours: 0 } : { _id: memberId, username: 'Unknown', role: 'member', usedHours: 0 };
    });
    await tasksStore.updateTask(props.task._id, { assignedMembers });
  };
  
  const updateTask = async (updatedTask: Partial<Task>) => {
  await tasksStore.updateTask(props.task._id, updatedTask);
  showEditModal.value = false;
};

//debounce the update of allocated hours for each member to avoid multiple requests
const allocatedHours = debounce(async () => {
  await tasksStore.updateTask(props.task._id, { hoursAllocated: props.task.hoursAllocated });
}, 300);

//check if the user's used hours is above 0 and the task status is todo, then update the task status to inProgress
const updateMemberUsedHours = debounce(async (memberId: string, usedHours: number) => {
  await tasksStore.updateMemberUsedHours(props.task._id, memberId, usedHours);
  if (usedHours > 0 && props.task.status === 'todo') {
    await tasksStore.updateTask(props.task._id, { status: 'inProgress' });
  }
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


//calculate the total used hours of the task by all the assigned members
const totalUsedHours = computed(() => {
  return props.task.assignedMembers.reduce((acc, member) => acc + member.usedHours, 0);
});


//calculate the total progress of the task
const totalProgress = computed(() => {
  //in casa the hours allocated are 0, we return 0 to avoid division by 0
  return props.task.hoursAllocated > 0 
  ? Math.min((totalUsedHours.value / props.task.hoursAllocated) * 100, 100)
  :0;
});

const amImemberInTask = (member: AssignedMember) => {
  return member._id === userStore.user?._id;
};
  </script>
  
  <style scoped>

  </style>
  