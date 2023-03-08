<script setup>
  import { defineProps, ref } from 'vue';
  import { useBlogsStore } from '@/stores'

  const deletePrompt = ref(false)
  const deleted = ref(false)
  // eslint-disable-next-line vue/no-setup-props-destructure
  const { blog, userId } = defineProps(["blog", "userId"])
  const toggleDeletePrompt = () => {
    deletePrompt.value = !deletePrompt.value
  }

  const blogsStore = useBlogsStore()
  const deletePost = () => {
    const postId = blog.id
    deleted.value = true
    blogsStore.deleteBlog(postId)
  }

  const placeholderImg = 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
</script>

<template>
  <v-card class="mx-auto" max-width="60vw">
    <v-img class="align-end text-white" height="200" :src="blog.img || placeholderImg" cover>
      <v-card-title>{{ blog.title }}</v-card-title>
    </v-img>
    <v-card-subtitle v-if="blog.author" class="pt-4">
      by {{ blog.author.username }}
    </v-card-subtitle>
    <v-card-text>
      <div>{{ blog.content }}</div>
    </v-card-text>
    <v-card-actions v-if="blog.author">
      <v-btn :to="`/post-form/${blog.id}`" v-if="blog.author.id === userId" color="tertiary" class="no-hover">
        Edit
      </v-btn>
      <v-btn @click="toggleDeletePrompt" v-if="blog.author.id === userId" color="tertiary" class="no-hover">
        Delete
      </v-btn>
    </v-card-actions>
    <v-banner v-if="deletePrompt" color="warning" icon="$warning" lines="two">
      <template v-slot:prepend>
        <v-avatar></v-avatar>
      </template>

      <v-banner-text class="my-2 text-body-1 font-weight-medium">
        Are you sure you want to delete this post? This action is irreversible.
      </v-banner-text>

      <v-banner-actions class="my-n9">
        <v-btn @click="deletePost">Confirm Delete</v-btn>
        <v-btn @click="toggleDeletePrompt">Cancel</v-btn>
      </v-banner-actions>
    </v-banner>
  </v-card>
</template>

<style scoped></style>