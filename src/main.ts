import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { useUserStore } from '@/stores/userStore';
import App from './App.vue';
import router from './router';
import { FontAwesomeIcon } from './fontAwesome';  // Import FontAwesome setup
import './index.css'; // Import the global css file

const app = createApp(App);
const pinia = createPinia();

app.component('font-awesome-icon', FontAwesomeIcon);  // Register FontAwesome component

app.use(pinia);
app.use(router);

const userStore = useUserStore();

// Initialize the store before mounting the app
userStore.initializeStore().then(() => {
  app.mount('#app');
});