<script setup>
  import { Form, useField, Field } from 'vee-validate';
  import * as Yup from 'yup';

  import { useAuthStore } from '@/stores';

  const schema = Yup.object().shape({
    email: Yup.string().email().required('Email is required').label("Email Address"),
    password: Yup.string().min(6).required('Password is required').label("Your Password")
  });

  const email = useField('email')
  const password = useField('password')


  const submit = values => {
    const authStore = useAuthStore();
    const { email, password } = values;

    return authStore.login(email, password)
  }

</script>

<template>
  <v-container class="py-10 px-6" fluid>
    <v-card width="33vw" class="mx-auto pa-4" color="surface">
      <h2 class="text-h4 mb-2 font-weight-medium">Login</h2>
      <Form @submit="submit" :validation-schema="schema" v-slot="{ errors, isSubmitting }">
        <div class="form-row">
          <div class="form-group col">
            <label>Email</label>
            <Field name="email" v-model="email.value.value" class="form-control" :class="{ 'is-invalid': errors.email }">
            </Field>
            <div class="invalid-feedback">{{ errors.email }}</div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col">
            <label>Password</label>
            <Field name="password" v-model="password.value.value" type="password" class="form-control"
              :class="{ 'is-invalid': errors.password }">
            </Field>
            <div class="invalid-feedback">{{ errors.password }}</div>
          </div>
        </div>
        <v-btn variant="flat" color="tertiary" class="me-4" type="submit" :disabled="isSubmitting">
          <v-progress-linear v-show="isSubmitting" indeterminate color="yellow-darken-2"></v-progress-linear>
          Log In
        </v-btn>
        <router-link to="/register" class="btn btn-link">Don't have an account? Register here.</router-link>
        <!-- <div v-if="errors.apiError" class="alert alert-danger mt-3 mb-0">{{ errors.apiError }}</div> -->
      </Form>
    </v-card>
  </v-container>
</template>
