import { defineStore } from 'pinia';
import apiClient from '../services/apiClient';
import { ref } from 'vue';
import { List } from '@/interfaces/IList';
import axios from 'axios';

export const useListStore = defineStore('list', () => {
    const lists = ref<List[]>([]);
    
    //fetch lists by project id
    const fetchLists = async (projectId: string) => {
        try {
        const response = await axios.get(`/api/lists/project/${projectId}`);
        lists.value = response.data;
        } catch (error) {
        console.error('Failed to fetch lists:', error);
        }
    };
    
    const createList = async (listData: List) => {
        try {
        const response = await apiClient.post('/lists', listData);
        lists.value.push(response.data);
        } catch (error) {
        console.error('Failed to create list:', error);
        }
    };

   const updateList = async (listData: List) => {
        try {
        const response = await apiClient.put(`/lists/${listData._id}`, listData);
        const index = lists.value.findIndex((l) => l._id === listData._id);
        if (index !== -1) {
            lists.value[index] = response.data;
        }
        } catch (error) {
        console.error('Failed to update list:', error);
        }
    };

    const deleteList = async (listId: string) => {
        try {
        await apiClient.delete(`/lists/${listId}`);
        lists.value = lists.value.filter((l) => l._id !== listId);
        } catch (error) {
        console.error('Failed to delete list:', error);
        }
    };
    
    return {
        lists,
        fetchLists,
        createList,
        updateList,
        deleteList,
    };
    });