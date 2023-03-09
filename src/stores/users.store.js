import { defineStore } from 'pinia'

import { fetchWrapper } from '@/helpers'

const baseUrl = `${process.env.VUE_APP_APIURL}/users`

export const useUsersStore = defineStore({
  id: 'users',
  state: () => ({
    currentUser: {},
    users: {}
  }),
  actions: {
    async getUserByUsername(username) {
      this.currentUser = { loading: true }
      try {
        const fetchedUser = await fetchWrapper.get(`${baseUrl}/${username}`)
        this.currentUser = fetchedUser
      } catch (error) {
        this.currentUser = { error }
      }
    }
  }
});