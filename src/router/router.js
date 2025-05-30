import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

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

const getCurrentUser = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

router.beforeEach(async (to, from, next) => {
  const user = await getCurrentUser();
  
  if (to.meta.requiresAuth && !user) {
    next('/login');
  } else if ((to.name === 'login' || to.name === 'signup') && user) {
    next('/user');
  } else {
    next();
  }
});

export default router;