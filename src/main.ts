import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { FontAwesomeIcon } from './fontAwesome';  // Import FontAwesome setup

const app = createApp(App);
const pinia = createPinia();

app.component('font-awesome-icon', FontAwesomeIcon);  // Register FontAwesome component

app.use(pinia);
app.use(router);
app.mount('#app');
