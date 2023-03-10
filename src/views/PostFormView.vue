<script setup>
  import { Form, Field } from 'vee-validate'
  import { storeToRefs } from 'pinia'
  import * as Yup from 'yup'
  import { useRoute } from 'vue-router'

  import { useAuthStore, useBlogsStore } from '@/stores'
  import { parseJwt, router } from '@/helpers'

  const blogsStore = useBlogsStore()

  let currentBlog = null
  const id = useRoute().params.id
  let header = "Create Post"

  if (id) {
    header = "Edit Post";
    ({ currentBlog } = storeToRefs(blogsStore))
    await blogsStore.getOneBlog(id)
  }

  const authStore = useAuthStore()
  const { user: authUser } = storeToRefs(authStore)
  const authorId = parseJwt(JSON.stringify(authUser)).id

  const schema = Yup.object().shape({
    title: Yup.string().required('A title is required').label("Title"),
    img: Yup.lazy((value) =>
      /^data/.test(value)
        ? Yup.string()
          .trim()
          .matches(
            /^data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@/?%\s]*)$/i,
            'Must be a valid data URI',
          ).label("Image URL (Optional)")
        : Yup.string().trim().url('Must be a valid URL').label("Image URL (Optional)")
    )
  });

  const submit = (values, { setErrors }) => {
    if (id) {
      const { title, content, img } = values
      return blogsStore.editBlog(title, content, img, id, authorId)
        .catch(error => setErrors({ apiError: error }))
    } else {
      const { title, content, img } = values
      return blogsStore.postBlog(title, content, img, authorId)
        .catch(error => setErrors({ apiError: error }))
    }
  }

  const goBack = () => {
    router.go(-1)
  }
</script>

<template>
  <v-container class="py-10 px-6" v-if="!(currentBlog?.loading || currentBlog?.error)" fluid>
    <v-card class="mx-auto pa-4" color="surface">
      <h2 class="text-h4 mb-2 font-weight-medium">{{ header }}</h2>
      <Form @submit="submit" :validation-schema="schema" :initial-values="currentBlog" v-slot="{ errors, isSubmitting }">
        <div class="form-row">
          <div class="form-group col">
            <label>Title</label>
            <Field name="title" type="text" class="form-control" :class="{ 'is-invalid': errors.title }"></Field>
            <div class="invalid-feedback">{{ errors.title }}</div>
          </div>
          <div class="form-group col">
            <label>Image Source URL</label>
            <Field name="img" type="text" class="form-control" :class="{ 'is-invalid': errors.img }"></Field>
            <div class="invalid-feedback">{{ errors.img }}</div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col">
            <label>Post Body</label>
            <Field name="content" v-slot="{ field }" rules="required">
              <textarea class="form-control" v-bind="field" />
            </Field>
          </div>
        </div>
        <div class="form-group">
          <v-btn variant="flat" color="tertiary" class="me-4" type="submit" :disabled="isSubmitting">
            <!-- <v-progress-linear v-show="isSubmitting" indeterminate color="yellow-darken-2"></v-progress-linear> -->
            Submit
          </v-btn>

          <a @click="goBack" class="btn btn-link">Cancel</a>
        </div>
        <div v-if="errors.apiError" class="alert alert-danger mt-3 mb-0">{{ errors.apiError }}</div>
      </Form>
    </v-card>
  </v-container>
</template>
