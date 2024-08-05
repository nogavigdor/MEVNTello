<template>
    <BaseModal buttonText="Add Task" modalTitle="Add New Task" actionName="Add" @click="addTask">
        <input v-model="newTask.name" class="border rounded w-full p-2 mb-4" placeholder="Task Name" />
          <input v-model="newTask.description" class="border rounded w-full p-2 mb-4" placeholder="Task Description" />
          <input v-model="newTask.hoursAllocated" type="number" class="border rounded w-full p-2 mb-4" placeholder="Hours Allocated" />
          <label class="block mb-2">Assign Members</label>
          <select v-model="selectedMembers" multiple class="border rounded w-full p-2 mb-4">
            <option v-for="member in projectTeamMembers" :key="member._id" :value="member._id">{{ getMemberName(member._id) }}</option>
          </select>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, defineProps } from 'vue';
import BaseModal from './BaseModal.vue';
import { NewTask } from '@/interfaces/ITask';
import { User } from '@/interfaces/IUser';
import { useUserStore } from '@/stores/userStore';
import { useTaskStore } from '@/stores/taskStore';
import { TeamMember } from '@/interfaces/ITeamMember';

const props = defineProps({listId: { type: String, required: true }, projectTeamMembers: { type: Array<TeamMember>, required: true } });
const userStore = useUserStore();
const taskStore = useTaskStore();

const newTask = ref<NewTask>({
    name: '',
    description: '',
    hoursAllocated: 0,
    hoursUsed: 0,
    status: 'todo',
    assignedMembers: [],
    listId: props.listId,
    subTasks: []
  });

const selectedMembers = ref<string[]>([]);

const getMemberName = (memberId: string ) => {
    const member = userStore.users.find((user: User) => user._id === memberId);
    return member ? member.username : 'Unknown';
  };

  const addTask = async () => {
    if (selectedMembers.value.length === 0) {
      alert('Please assign at least one member to the task.');
      return;
    }
    // Map selected member IDs to TeamMember objects
    newTask.value.assignedMembers = selectedMembers.value.map(id => {
      const member = props.projectTeamMembers.find(m => m._id === id);
      return member ? { _id: member._id, username: getMemberName(member._id), role: member.role } : { _id: id, username: 'Unknown', role: 'member' };
    });
    await taskStore.createTask(props.listId, newTask.value);
    newTask.value = {
      name: '',
      description: '',
      hoursAllocated: 0,
      hoursUsed: 0,
      status: 'todo',
      assignedMembers: [],
      listId: props.listId,
      subTasks: []
    };
    selectedMembers.value = [];
  };
</script>