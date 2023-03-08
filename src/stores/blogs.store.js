import { defineStore } from 'pinia'
import { fetchWrapper, parseJwt } from '@/helpers'
import { useAuthStore } from './auth.store';

const baseUrl = `${process.env.VUE_APP_APIURL}/blogs`

export const useBlogsStore = defineStore({
  id: 'blogs',
  state: () => ({
    blogs: [],
    currentBlog: {},
    ownBlogs: [],
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
    async getOneBlog(id) {
      this.currentBlog = { loading: true }

      try {
        const fetchedBlog = await fetchWrapper.get(`${baseUrl}/${id}`)
        this.currentBlog = fetchedBlog
      } catch (error) {
        this.currentBlog = { error }
      }
    },
    async editBlog(title, content, img, id, authorId) {
      const updatedBlog = await fetchWrapper.put(`${baseUrl}/${id}`, { title, content, img, authorId })
      this.blogs = this.blogs.filter(blog => blog.id !== id) + updatedBlog

      this.$router.push('/')
    },
    async getOwnBlogs() {
      this.ownBlogs = { loading: true };
      const authStore = useAuthStore();
      const user = authStore.user
      const userId = parseJwt(JSON.stringify(user)).id

      try {
        const fetchedBlogs = await fetchWrapper.get(baseUrl)
        this.ownBlogs = fetchedBlogs.filter(blog => blog.author.id === userId)
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
    async deleteBlog(id) {
      await fetchWrapper.delete(`${baseUrl}/${id}`)
      this.blogs = this.blogs.filter(blog => blog.id !== id)
    }
  }
});
