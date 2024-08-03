<template>
    <div class="flex space-x-4 overflow-x-auto">
        <div v-for="(step, index) in steps" :key="index" class="bg-gray-100 rounded-lg p-4 w-80">
        {{step}}
        </div>
       
    </div>
</template>
<script setup lang="ts">
import { ref, computed, defineProps, onMounted } from 'vue';
import { useTaskStore } from '@/stores/taskStore';
import TaskItem from '@/components/TaskItem.vue';

const props = defineProps<{ steps: string[] }>();
const tasksStore = useTaskStore();

const statuses = ['todo', 'inProgress', 'done'];
const statusLabels: { [key: string]: string } = {

}
const tasksByStatus = (status: string) => {
    return tasksStore.tasks.filter(task => task.status === status);
};  

onMounted(() => {
    tasksStore.fetchTasksByProject(props.projectId);
});

</script>
<style scoped>
</style>