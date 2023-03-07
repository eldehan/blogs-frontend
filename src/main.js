import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia';
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'

import App from './App.vue'
import { router } from './helpers'

const pinia = createPinia()
pinia.use(({ store }) => {
  store.$router = markRaw(router)
});

loadFonts()

createApp(App)
  .use(pinia)
  .use(vuetify)
  .use(router)
  .mount('#app')


/*
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import vuetify from './plugins/vuetify'


import App from './App.vue';
import { router } from './helpers';

// setup fake backend
import { fakeBackend } from './helpers';
fakeBackend();

createApp(App)
  .use(createPinia())
  .use(vuetify)
  .use(router)
  .mount('#app')
*/