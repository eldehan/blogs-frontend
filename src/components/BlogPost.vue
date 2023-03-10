<script setup>
  import { defineProps, ref } from 'vue'
  import { storeToRefs } from 'pinia';
  import { useAuthStore, useBlogsStore } from '@/stores'
  import { parseJwt } from '@/helpers'

  const deletePrompt = ref(false)
  const deleted = ref(false)
  const apiError = ref('')
  // eslint-disable-next-line vue/no-setup-props-destructure
  const { blog, username } = defineProps(["blog", "username"])
  const toggleDeletePrompt = () => {
    deletePrompt.value = !deletePrompt.value
  }

  const blogsStore = useBlogsStore()
  const deletePost = () => {
    const authStore = useAuthStore()
    const { user: authUser } = storeToRefs(authStore)
    const authorId = parseJwt(JSON.stringify(authUser)).id

    const postId = blog.id
    deleted.value = true
    return blogsStore.deleteBlog(postId, authorId)
      .catch(error => apiError.value = error)
  }
</script>

<template>
  <v-card v-if="!deleted" class="mx-auto">
    <v-img v-if="blog.img" class="align-end text-white" height="200" :src="blog.img || placeholderImg" cover>
      <template v-slot:placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
        </div>
      </template>
      <v-card-title>{{ blog.title }}</v-card-title>
    </v-img>
    <div v-else class="text-white pt-4 dark">
      <v-card-title>{{ blog.title }}</v-card-title>
    </div>
    <v-card-subtitle v-if="blog.author" class="pt-4">
      by {{ blog.author.username }}
    </v-card-subtitle>
    <v-card-text>
      <div>{{ blog.content }}</div>
    </v-card-text>
    <v-card-actions v-if="blog.author">
      <v-btn :to="`/post-form/${blog.id}`" v-if="blog.author.username === username" color="tertiary" class="no-hover">
        Edit
      </v-btn>
      <v-btn @click="toggleDeletePrompt" v-if="blog.author.username === username" color="tertiary" class="no-hover">
        Delete
      </v-btn>
    </v-card-actions>
    <v-banner v-if="deletePrompt && !apiError" color="warning" icon="$warning" lines="two">
      <template v-slot:prepend>
        <v-avatar></v-avatar>
      </template>

      <v-banner-text class="my-2 text-body-1 font-weight-medium">
        Are you sure you want to delete this post? This action is irreversible.
      </v-banner-text>

      <v-banner-actions class="my-n10">
        <v-btn @click="deletePost">Confirm Delete</v-btn>
        <v-btn @click="toggleDeletePrompt">Cancel</v-btn>
      </v-banner-actions>
    </v-banner>
    <v-banner v-else-if="deletePrompt && apiError" color="danger" icon="$warning" lines="two">
      <template v-slot:prepend>
        <v-avatar></v-avatar>
      </template>

      <v-banner-text class="my-2 text-body-1 font-weight-medium">
        {{ apiError }}
      </v-banner-text>

      <v-banner-actions class="my-n9">
        <v-btn @click="toggleDeletePrompt">Cancel</v-btn>
      </v-banner-actions>

    </v-banner>
  </v-card>
</template>

<style scoped>
  .dark {
    background-color: #6b738c
  }
</style>