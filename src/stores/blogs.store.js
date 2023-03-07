import { defineStore } from 'pinia'
import { fetchWrapper, parseJwt } from '@/helpers'
import { useAuthStore } from './auth.store';

const baseUrl = `${process.env.VUE_APP_APIURL}/blogs`
console.log(baseUrl)

export const useBlogsStore = defineStore({
  id: 'blogs',
  state: () => ({
    blogs: [],
    currentBlog: {},
    ownBlogs: [],
  }),
  actions: {
    async getAll() {
      this.blogs = { loading: true };
      fetchWrapper.get(baseUrl)
        .then(blogs => this.blogs = blogs.sort((a, b) => a.updated_at < b.updated_at))
        .catch(error => this.blogs = { error })
    },
    async getOneBlog(id) {
      this.currentBlog = { loading: true };
      fetchWrapper.get(`${baseUrl}/${id}`)
        .then(blog => this.currentBlog = blog)
        .catch(error => this.currentBlog = { error })
    },
    async editBlog(title, content, img, id) {
      console.log(id)
      fetchWrapper.put(`${baseUrl}/${id}`, { title, content, img })
        .then(updatedBlog => this.blogs = this.blogs.filter(blog => blog.id !== id) + updatedBlog)
        .catch(error => this.blogs = { error })
        .finally(this.$router.push('/'))
    },
    async getOwnBlogs() {
      this.ownBlogs = { loading: true };
      const authStore = useAuthStore();
      const user = authStore.user
      const userId = parseJwt(JSON.stringify(user)).id
      fetchWrapper.get(baseUrl)
        .then(blogs => this.ownBlogs = blogs.filter(blog => blog.author.id === userId))
        .catch(error => this.blogs = { error })
    },
    async postBlog(title, content, img, authorId) {
      fetchWrapper.post(baseUrl, { title, content, img, authorId })
        .then(blog => this.blogs += blog)
        .catch(error => this.blogs = { error })
      this.$router.push('/');
    },
    async deleteBlog(id) {
      fetchWrapper.delete(`${baseUrl}/${id}`)
        .then(() => this.blogs = this.blogs.filter(blog => blog.id !== id))
        .catch(error => this.blogs = { error })
    }
  }
});
