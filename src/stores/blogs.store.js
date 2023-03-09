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
        const fetchedBlogs = await fetchWrapper.get(baseUrl)
        this.blogs = fetchedBlogs.sort((a, b) => a.updated_at < b.updated_at)
      } catch (error) {
        this.blogs = { error }
      }
    },
    async getOneBlog(blogId) {
      this.currentBlog = { loading: true }

      try {
        const fetchedBlog = await fetchWrapper.get(`${baseUrl}/${blogId}`)
        this.currentBlog = fetchedBlog
      } catch (error) {
        this.currentBlog = { error }
      }
    },
    async editBlog(title, content, img, blogId, authorId) {
      const updatedBlog = await fetchWrapper.put(`${baseUrl}/${blogId}`, { title, content, img, authorId })
      this.blogs = this.blogs.filter(blog => blog.id !== blogId) + updatedBlog

      this.$router.push('/')
    },
    async getBlogsByUser(username) {
      this.filteredBlogs = { loading: true }

      const usersStore = useUsersStore()
      await usersStore.getUserByUsername(username)

      try {
        if (this.blogs.length > 0) {
          this.filteredBlogs = this.blogs.filter(blog => blog.author.id === usersStore.currentUser.id)
        } else {
          const fetchedBlogs = await fetchWrapper.get(baseUrl)
          this.filteredBlogs = fetchedBlogs.filter(blog => blog.author.id === usersStore.currentUser.id)
        }
      } catch (error) {
        this.blogs = { error }
      }
    },
    async postBlog(title, content, img, authorId) {
      try {
        const postedBlog = await fetchWrapper.post(baseUrl, { title, content, img, authorId })
        this.blogs += postedBlog
      } catch (error) {
        this.blogs = { error }
      }

      this.$router.push('/');
    },
    async deleteBlog(blogId) {
      await fetchWrapper.delete(`${baseUrl}/${blogId}`)
      this.blogs = this.blogs.filter(blog => blog.id !== blogId)
    }
  }
});
