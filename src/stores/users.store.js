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
        const response = await fetchWrapper.get(`${baseUrl}/${username}`)
        this.currentUser = response.data
      } catch (error) {
        this.currentUser = { error }
      }
    }
  }
});