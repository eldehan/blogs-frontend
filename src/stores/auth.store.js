import { defineStore } from 'pinia';

import { fetchWrapper, router } from '@/helpers';

const baseUrl = `${process.env.VUE_APP_APIURL}/users`;

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    user: JSON.parse(localStorage.getItem('user')),
    returnUrl: null
  }),
  actions: {
    async register(username, email, password, passwordConfirmation) {
      await fetchWrapper.post(`${baseUrl}/register`, { username, email, password, passwordConfirmation })
      router.push('/login');
    },
    async login(email, password) {
      const user = await fetchWrapper.post(`${baseUrl}/login`, { email, password });

      // update pinia state
      this.user = user;

      // store user details and jwt in local storage to keep user logged in between page refreshes
      localStorage.setItem('user', JSON.stringify(user));

      // redirect to previous url or default to home page
      router.push(this.returnUrl || '/');
    },
    logout() {
      this.user = null;
      localStorage.removeItem('user');
      router.push('/login');
    }
  }
});
