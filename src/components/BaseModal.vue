<template>
    <button class="bg-green-500 text-white p-2 rounded mt-4" @click="showModal = true">{{ buttonText }}</button>
    <div v-if="showModal" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
    <div class="bg-white p-6 rounded shadow-lg w-96">
        <h2 class="text-xl font-bold mb-4">{{ modalTitle }}</h2>
        <slot></slot>
        
        <div class="flex justify-end space-x-2">
            <button class="bg-gray-500 text-white p-2 rounded" @click="showModal = false">Cancel</button>
            <button class="bg-blue-500 text-white p-2 rounded" @click="$emit('click'); showModal = false">{{ actionName }}</button>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue';

const showModal = ref(false);
const props = defineProps<{ buttonText: string, modalTitle: string, actionName: string }>();

</script>
