import { defineStore } from 'pinia'

import { fetchWrapper } from '@/helpers'
import { useUsersStore } from './users.store'

const baseUrl = `${process.env.VUE_APP_APIURL}/blogs`

export const useBlogsStore = defineStore({
  id: 'blogs',
  state: () => ({
    blogs: [],
    currentBlog: {},
    filteredBlogs: [],
  }),
  actions: {
    async getAll() {
      this.blogs = { loading: true }

      try {
        const response = await fetchWrapper.get(baseUrl)
        const fetchedBlogs = response.data
        this.blogs = fetchedBlogs.sort((a, b) => a.updated_at < b.updated_at)
      } catch (error) {
        this.blogs = { error }
      }
    },
    async getOneBlog(blogId) {
      this.currentBlog = { loading: true }

      try {
        const response = await fetchWrapper.get(`${baseUrl}/${blogId}`)
        const fetchedBlog = response.data
        this.currentBlog = fetchedBlog
      } catch (error) {
        this.currentBlog = { error }
      }
    },
    async editBlog(title, content, img, blogId, author) {
      const response = await fetchWrapper.put(`${baseUrl}/${blogId}`, { title, content, img, author })
      const updatedBlog = response.data
      this.blogs = this.blogs.filter(blog => blog.id !== blogId) + updatedBlog

      this.$router.push('/')
    },
    async getBlogsByUser(username) {
      this.filteredBlogs = { loading: true }

      const usersStore = useUsersStore()
      await usersStore.getUserByUsername(username)

      try {
        if (this.blogs.length > 0) {
          this.filteredBlogs = this.blogs.filter(blog => blog.author.id === usersStore.currentUser.id).sort((a, b) => a.updated_at < b.updated_at)
        } else {
          const response = await fetchWrapper.get(baseUrl)
          const fetchedBlogs = response.data

          this.filteredBlogs = fetchedBlogs.filter(blog => blog.author.id === usersStore.currentUser.id).sort((a, b) => a.updated_at < b.updated_at)
        }
      } catch (error) {
        this.blogs = { error }
      }
    },
    async postBlog(title, content, img, authorId) {
      try {
        const response = await fetchWrapper.post(baseUrl, { title, content, img, authorId })
        const postedBlog = response.data
        this.blogs += postedBlog
      } catch (error) {
        this.blogs = { error }
      }

      this.$router.push('/');
    },
    async deleteBlog(blogId, author) {
      await fetchWrapper.delete(`${baseUrl}/${blogId}`, { author })
      this.blogs = this.blogs.filter(blog => blog.id !== blogId)
    }
  }
});
