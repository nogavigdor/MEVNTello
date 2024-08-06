<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold text-primary mb-4">Create New Project</h1>
    <form @submit.prevent="submitForm" class="grid grid-cols-2 gap-4">
      <div>
        <!-- Project details section -->
        <div class="mb-4">
          <label for="projectName" class="block text-sm font-medium text-gray-700">Project Name</label>
          <input type="text" id="projectName" v-model="form.name" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
        </div>
        <div class="mb-4">
          <label for="projectDescription" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea id="projectDescription" v-model="form.description" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"></textarea>
        </div>
        <div class="mb-4">
          <label for="allocatedHours" class="block text-sm font-medium text-gray-700">Allocated Hours</label>
          <input type="number" id="allocatedHours" v-model.number="form.allocatedHours" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
        </div>
        <div class="mb-4">
          <label for="startDate" class="block text-sm font-medium text-gray-700">Start Date</label>
          <input type="date" id="startDate" v-model="form.startDate" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
        </div>
        <div class="mb-4">
          <label for="endDate" class="block text-sm font-medium text-gray-700">End Date</label>
          <input type="date" id="endDate" v-model="form.endDate" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
        </div>
      </div>

      <!-- Team member assignment and task templates section -->
      <div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Assign Team Members and Roles</label>
          <div class="h-48 overflow-y-auto border border-gray-300 rounded-md p-2">
            <div v-for="user in users" :key="user._id" class="flex items-center space-x-3 mb-2">
              <input type="checkbox" :value="user._id" @change="handleCheckboxChange($event, user._id)">
              <span>{{ user.username }}</span>
              <select v-model="roles[user._id]">
                <option value="member">Member</option>
                <option value="leader">Leader</option>
              </select>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Select Task Template</label>
          <div class="h-48 overflow-y-auto border border-gray-300 rounded-md p-2">
            <div v-for="template in taskTemplates" :key="template._id" class="flex items-center space-x-3 mb-2">
              <input type="radio" :value="template._id" v-model="selectedTemplate">
              <span>{{ template.name }}</span>
            </div>
            <div>
              <input type="radio" value="" v-model="selectedTemplate">
              <span>Start without template</span>
            </div>
          </div>
        </div>
      </div>
      <button type="submit" class="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded">Save Project and Continue</button>
    </form>
   
  </div>
</template>
  
  <script setup lang="ts">
  import { ref, onMounted, defineEmits } from 'vue';
  import { useUserStore } from '@/stores/userStore';
  import { useProjectStore } from '@/stores/projectStore';
  import { useTaskStore } from '@/stores/taskStore';
  import { User } from '@/interfaces/IUser'; 
  import { Project } from '@/interfaces/IProject'; 
  import { TaskTemplate } from '@/interfaces/ITaskTemplate';
  import { TeamMember } from '@/interfaces/ITeamMember';
  import { defineProps } from 'vue';
  
  import router from '@/router';

    // const props = defineProps<{ users: User[] }>();
  
    const users = ref<User[]>([]);

  const userStore = useUserStore();
  const projectStore = useProjectStore();
  const tasksStore = useTaskStore();
  const taskTemplates = ref<TaskTemplate[]>([]);
  const roles = ref<Record<string, string>>({});
  const selectedTemplate = ref<string | undefined>(undefined); // Update the type of selectedTemplate ref
  const selectedTeamMembers = ref<string[]>([]); // Declare selectedTeamMembers ref
  const emit = defineEmits(['update-status']);
  
  onMounted(async () => {
    await userStore.fetchAllUsers();
    await tasksStore.fetchTaskTemplates();
    console.log('all task tamplates', tasksStore.taskTemplates);
    users.value = userStore.getUsers;
    users.value.forEach(user => roles.value[user._id] = 'member'); // Default to 'member'
  });
  
  taskTemplates.value = tasksStore.taskTemplates;
  
  // Setup ref data for form and roles
  const form = ref<Project>({
    name: '',
    creationStatus: 'tasks', // Initialize with 'todo' status,
    selectedTemplate:'',
    description: '',
    creator: userStore.user?._id as string,
    startDate: new Date(new Date().toISOString().split('T')[0]), // Initialize with today's date in YYYY-MM-DD format
    endDate: new Date(new Date().toISOString().split('T')[0]), // Initialize with today's date in YYYY-MM-DD format
    allocatedHours: 0,
    teamMembers: []
  });
  

  
  // Handle checkbox change event
  const handleCheckboxChange = (event: Event, _id: string) => {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      selectedTeamMembers.value.push(_id);
    } else {
      selectedTeamMembers.value = selectedTeamMembers.value.filter(id => id !== _id);
    }
  };
  
  
  
  // Submit form data including dynamic role assignments
  const submitForm = async () => {
    const projectData: Project = {
      ...form.value,
      //overides default form values with the form input values
      creationStatus: 'tasks',
      selectedTemplate: selectedTemplate.value,
      startDate: new Date(form.value.startDate),
      endDate: new Date(form.value.endDate),
      teamMembers: selectedTeamMembers.value.map(_id => ({
        _id,
        role: roles.value[_id] as "member" | "leader"
      })),
      lists: []
  
    };
  
    console.log('Project Data:', projectData); // Log the data to verify structure
    console.log('Selected Team Members:', selectedTeamMembers.value);
    console.log('Roles:', roles.value);
  
  
    try {
      const newProject =await projectStore.createProject(projectData);
      alert('Project created successfully!');
      //router.replace(`/projects/${newProject._id}`);
      emit('update-status', 'tasks'); 
    } catch (error) {
      alert('Failed to create project');
      console.error(error);
    }
  };
  </script>
  