import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

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

  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path : '/projects',
    name : 'Projects',
    component : () => import('../views/MyProjectsView.vue'),
  },
  {
    path: '/projects/new',
    name: 'NewProject',
    component: () => import('../views/NewProjectView.vue'),

  },
  {
    path: '/projects/:id',
    name: 'Project',
    component: () => import('../views/ProjectView.vue'),
  
  }


];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});


//Navigation guards
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  if (to.matched.some(record => record.meta.requiresAuth) && !userStore.isAuthenticated) {
    // Redirect to login page if not authenticated
    next({ name: 'Login' });
  } else {
    next(); // make sure to always call next()!
  }
});
export default router;
