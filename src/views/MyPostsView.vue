<script setup>
  import { storeToRefs } from 'pinia';
  import { parseJwt } from '@/helpers'
  import { useAuthStore, useBlogsStore } from '@/stores'
  import BlogPost from '@/components/BlogPost.vue';

  const authStore = useAuthStore()
  const { user: authUser } = storeToRefs(authStore)
  authUser._object.user
  const userId = authUser._object.user ? parseJwt(JSON.stringify(authUser)).id : -1

  const blogsStore = useBlogsStore()
  const { ownBlogs } = storeToRefs(blogsStore)
  blogsStore.getOwnBlogs()

</script>

<template>
  <v-container class="py-8 px-6" fluid>
    <v-row>
      <v-col class="text-right">
        <v-btn variant="tonal" color="surface" class="new-post-btn" prepend-icon="mdi-plus-circle" to="/new-post">
          New Post
        </v-btn>
      </v-col>
      <v-col v-for="blog in ownBlogs" :key="blog.id" cols="12">
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