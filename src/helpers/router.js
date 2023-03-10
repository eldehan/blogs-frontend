import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/stores'
import { PostsView, LoginView, PostFormView, RegisterView } from '@/views'

export const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: 'active',
  routes: [
    { path: '/', component: PostsView },
    { path: '/login', component: LoginView },
    { path: '/user/:username/posts/', component: PostsView },
    { path: '/post-form', component: PostFormView },
    { path: '/post-form/:id', component: PostFormView },
    { path: '/register', component: RegisterView }
  ]
})

router.beforeEach(async (to) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login', '/', '/register']
  const authRequired = !publicPages.includes(to.path)
  const auth = useAuthStore()

  if (authRequired && !auth.user) {
    auth.returnUrl = to.fullPath
    return '/login'
  }
})
