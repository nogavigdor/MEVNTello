import { createRouter, createWebHistory } from 'vue-router';

//import UserRegister from '../components/UserRegister.vue';

const routes = [
  { path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue') },
  
  { path: '/register',
    name: 'Register',
     component: () => import('../views/RegisterView.vue') },

  { path: '/login',
    name: 'Login',
     component: () => import('../views/LoginView.vue') },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

//Authentication
const isAuthenticated = () => {
  return true;
}

//Navigation guards

//This guard will redirect the user to the login page if they are not authenticated
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && to.name !== 'Register' && !isAuthenticated()) next({ name: 'Login' });
  else next();
});


export default router;
