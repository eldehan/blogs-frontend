<script setup>
  import { storeToRefs } from 'pinia'
  import { parseJwt } from '@/helpers'
  import { useAuthStore, useBlogsStore } from '@/stores'
  import BlogPost from '@/components/BlogPost.vue';

  const authStore = useAuthStore()
  const { user: authUser } = storeToRefs(authStore)
  const userId = authUser._object.user ? parseJwt(JSON.stringify(authUser)).id : -1

  const blogsStore = useBlogsStore()
  const { blogs } = storeToRefs(blogsStore)
  blogsStore.getAll()
</script>

<template>
  <v-container class="py-8 px-6" fluid>
    <v-row>
      <v-col class="text-right">
        <v-btn variant="tonal" color="surface" class="new-post-btn no-hover" prepend-icon="mdi-plus-circle"
          to="/post-form">
          New Post
        </v-btn>
      </v-col>
      <v-col v-for="blog in blogs" :key="blog.id" cols="12">
        <BlogPost :blog="blog" :userId="userId" />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
  .new-post-btn {
    margin-right: 19.25%
  }
</style>