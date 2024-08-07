<template>
    <BaseModal :buttonText="buttonText" :modalTitle="modalTitle" actionName="Save" @action="saveTask">
      <input v-model="editedTask.name" class="border rounded w-full p-2 mb-4" placeholder="Task Name" />
      <input v-model="editedTask.description" class="border rounded w-full p-2 mb-4" placeholder="Task Description" />
      <input v-model="editedTask.hoursAllocated" type="number" class="border rounded w-full p-2 mb-4" placeholder="Hours Allocated" />
      <label class="block mb-2">Assign Members</label>
      <select v-model="selectedMembers" multiple class="border rounded w-full p-2 mb-4">
        <option v-for="member in projectTeamMembers" :key="member._id" :value="member._id">{{ getMemberName(member._id) }}</option>
      </select>
    </BaseModal>
  </template>
  
  <script setup lang="ts">
  import { ref, defineProps, watch, computed } from 'vue';
  import BaseModal from './BaseModal.vue';
  import { Task, NewTask } from '@/interfaces/ITask';
  import { TeamMember } from '@/interfaces/ITeamMember';
  import { User } from '@/interfaces/IUser';
  import { useUserStore } from '@/stores/userStore';
  import { useTaskStore } from '@/stores/taskStore';
  
  const props = defineProps<{
    task: Task;
    projectTeamMembers: TeamMember[];
    buttonText: string;
    modalTitle: string;
    onSave: (updatedTask: Task) => void;
  }>();
  
  const userStore = useUserStore();
  const taskStore = useTaskStore();
  
  const editedTask = ref<Task>({ ...props.task });
  const selectedMembers = ref<string[]>([]);
  
  watch(() => props.task, (newTask) => {
    editedTask.value = { ...newTask };
    selectedMembers.value = newTask.assignedMembers.map(member => member._id).filter(id => id !== undefined) as string[];
  }, { immediate: true });
  
  const getMemberName = (memberId: string) => {
    const member = userStore.users.find((user: User) => user._id === memberId);
    return member ? member.username : 'Unknown';
  };
  
  const saveTask = async () => {
    editedTask.value.assignedMembers = selectedMembers.value.map(id => {
      const member = props.projectTeamMembers.find(m => m._id === id);
      return member ? { _id: member._id, username: getMemberName(id), role: member.role, usedHours: 0 } : { _id: id, username: 'Unknown', role: 'member', usedHours: 0 };
    });
    props.onSave(editedTask.value);
  };
  </script>
  