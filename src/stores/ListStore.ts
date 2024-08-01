import { defineStore } from 'pinia';
import apiClient from '../services/apiClient';
import { ref, computed } from 'vue';
import { List, NewList } from '@/interfaces/IList';
import axios from 'axios';

export const useListStore = defineStore('list', () => {
    const lists = ref<List[]>([]);
    
    //fetch lists by project id, set the lists array to the response data and return the lists array
    const fetchLists = async (projectId: string) => {
        try {
        const response = await apiClient.get(`/lists/project/${projectId}`);
        lists.value = response.data;
        return lists.value;
        } catch (error) {
        console.error('Failed to fetch lists:', error);
        }
    };
    //create a new list and, add it to the lists array and return the new list
    const createList = async (listData: NewList) => {
        try {
        const response = await apiClient.post('/lists', listData);
        lists.value.push(response.data);
        return response.data;
        } catch (error) {
        console.error('Failed to create list:', error);
        }
    };

    //update a list by id, find the index of the list in the lists array and update the list at that index with the response data
   const updateList = async (listData: List) => {
        try {
        const response = await apiClient.put(`/lists/${listData._id}`, listData);
        const index = lists.value.findIndex((l) => l._id === listData._id);
        if (index !== -1) {
            lists.value[index] = response.data;
        }
        return response.data;
        } catch (error) {
        console.error('Failed to update list:', error);
        }
    };

    //delete a list by id, filter the lists array to remove the list with the id
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