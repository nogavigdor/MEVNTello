import { createRouter, createWebHistory, RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { useProjectStore } from '@/stores/projectStore';


//When a user navigates to a project, there is a need to check the project creation status
//before allowing the user to view the project.
const checkProjectCreationStatus = async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const projectStore = useProjectStore();
  const projectId = to.params.id as string;

  try {
    const project = await projectStore.fetchProjectById(projectId);
    if (project && project.creationStatus !== 'complete') {
      next({
        name: 'NewProject',
        query: { creationStatus: project.creationStatus, projectId: projectId }
      });
    } else {
      next();
    }
  } catch (error) {
    console.error('Failed to fetch project:', error);
    next(false); // or redirect to an error page if needed
  }
};

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
    beforeEnter: checkProjectCreationStatus,
  
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
  }
  // Redirect to dashboard if already authenticated
  else if ((to.name === 'Login' || to.name === 'Register') && userStore.isAuthenticated) {
    // Redirect to dashboard if already authenticated
    next({ name: 'Dashboard' });
  }
  else {
    next(); // make sure to always call next()!
  }
});

export default router;
