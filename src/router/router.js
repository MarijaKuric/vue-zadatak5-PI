import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../stores/userStore';


import SignUpView from '@/views/SignUpView.vue';
import LogInView from '@/views/LogInView.vue';
import UserView from '@/views/UserView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView,
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'login',
      component: LogInView,
      meta: { requiresAuth: false }
    },
    {
      path: '/user',
      name: 'user',
      component: UserView,
      meta: { requiresAuth: true }
    },
    {
      path: '/',
      redirect: '/login'
    }
  ]
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  if (to.meta.requiresAuth && !userStore.currentUser) {
    next('/login');
  } else if ((to.name === 'login' || to.name === 'signup') && userStore.currentUser) {
    next('/user');
  } else {
    next();
  }
});

export default router;