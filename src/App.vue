<script setup>
  import { RouterView } from 'vue-router'
  import { useAuthStore } from '@/stores'
  import { storeToRefs } from 'pinia'
  import { parseJwt } from '@/helpers'

  const authStore = useAuthStore();
  let username = ""

  if (authStore.user) {
    const { user } = storeToRefs(authStore)
    username = user._object.user ? parseJwt(JSON.stringify(user)).username : ""
  }

</script>

<template>
  <v-app>
    <v-app-bar class="px-3" color="surface" flat density="compact">
      <v-spacer></v-spacer>
      <v-tabs centered color="black">
        <v-tab class="no-hover" to="/">Home</v-tab>
        <v-btn v-if="username" color="black" variant="plain" rounded="0" class="align-self-center me-4" height="100%">
          Profile
          <v-icon end>
            mdi-menu-down
          </v-icon>
          <v-menu activator="parent">
            <v-list class="bg-grey-lighten-3">
              <v-list-item :to="`/user/${username}/posts/`" class="no-hover">
                My Posts
              </v-list-item>
              <v-list-item @click="authStore.logout()" class="no-hover">
                Logout
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
        <v-tab v-else to="/login">Login</v-tab>
      </v-tabs>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
      <RouterView :key="$route.fullPath" />
    </v-main>
  </v-app>
</template>

<style>
  .no-hover:hover {
    color: inherit !important;
    text-decoration: none;
  }
</style>