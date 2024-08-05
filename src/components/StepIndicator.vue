<template>
    <div class="flex space-x-4 overflow-x-auto">
        <div v-for="(step, index) in steps" :key="index" class="bg-gray-100 rounded-lg p-4 w-80" :class="backgroundColor(step)">
        {{step}}
        </div>
       
    </div>
</template>
<script setup lang="ts">
import { ref, computed, defineProps, onMounted } from 'vue';
import { useTaskStore } from '@/stores/taskStore';
import TaskPresentation from '@/components/TaskPresentation.vue';

const props = defineProps<{ steps: string[], indicator: string }>();

const backgroundColor = (currentStep: string) => {
    return props.indicator === currentStep.toLowerCase() ? 'bg-green-500' : 'bg-gray-100';
};

</script>
<style scoped>
</style>