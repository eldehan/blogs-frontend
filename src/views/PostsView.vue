<script setup>
  import { storeToRefs } from 'pinia'
  import { parseJwt } from '@/helpers'
  import { useBlogsStore, useAuthStore } from '@/stores'
  import BlogPost from '@/components/BlogPost.vue'
  import { useRoute } from 'vue-router'

  const blogsStore = useBlogsStore()
  const authStore = useAuthStore()

  let username = ""
  let blogs = null
  let filteredBlogs = null
  let header = "All Posts"

  // if route is for a specific user, filter posts to that user's posts and render that; otherwise, render all posts
  if (useRoute().path.includes("/user")) {
    username = useRoute().params.username
    header = `${username}'s Posts'`;

    ({ filteredBlogs } = storeToRefs(blogsStore))
    blogsStore.getBlogsByUser(username)
  } else {
    const { user: authUser } = storeToRefs(authStore)
    username = parseJwt(JSON.stringify(authUser)).username;

    ({ blogs } = storeToRefs(blogsStore))
    blogsStore.getAll()
  }

</script>

<template>
  <v-container class="py-8 px-6" fluid>
    <h2 class="text-h4 mb-2 font-weight-medium">{{ header }}</h2>
    <v-row>
      <v-col class="text-right">
        <v-btn variant="tonal" color="surface" class="new-post-btn no-hover" prepend-icon="mdi-plus-circle"
          to="/post-form">
          New Post
        </v-btn>
      </v-col>
      <v-container v-if="filteredBlogs">
        <v-col v-for="blog in filteredBlogs" :key="blog.id" cols="12">
          <BlogPost :blog="blog" :username="username" />
        </v-col>
      </v-container>
      <v-container v-else-if="blogs">
        <v-col v-for="blog in blogs" :key="blog.id" cols="12">
          <BlogPost :blog="blog" :username="username" />
        </v-col>
      </v-container>
    </v-row>
  </v-container>
</template>

<style scoped>
  .new-post-btn {
    margin-right: 19.25%
  }
</style>