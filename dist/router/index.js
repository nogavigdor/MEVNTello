import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
//import UserRegister from '../components/UserRegister.vue';
const routes = [
  { path: '/', component: HomePage },
  // { path: '/register', component: UserRegister },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
