<template>
    <label class="block mb-2">Assign Members</label>
          <select v-model="selectedMembers" multiple class="border rounded w-full p-2 mb-4">
            <option v-for="member in projectTeamMembers" :key="member._id" :value="member._id">{{ getMemberName(member._id) }}</option>
          </select>
</template>
<script setup lang="ts">
import { ref, computed, defineProps } from 'vue';
import { getMemberName } from '@/utils/getMemberName';
import { TeamMember } from '@/interfaces/ITeamMember';
const selectedMembers = defineModel();
const props = defineProps<{projectTeamMembers: TeamMember[]}>();
</script>