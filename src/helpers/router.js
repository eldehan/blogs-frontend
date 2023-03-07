import { createRouter, createWebHistory } from 'vue-router';

import { useAuthStore } from '@/stores';
import { HomeView, LoginView, MyPostsView, PostFormView, RegisterView } from '@/views';

export const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: 'active',
  routes: [
    { path: '/', component: HomeView },
    { path: '/login', component: LoginView },
    { path: '/my-posts', component: MyPostsView },
    { path: '/post-form', component: PostFormView },
    { path: '/post-form/:id', component: PostFormView },
    { path: '/register', component: RegisterView }
  ]
});

router.beforeEach(async (to) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login', '/', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const auth = useAuthStore();

  if (authRequired && !auth.user) {
    auth.returnUrl = to.fullPath;
    return '/login';
  }
});
