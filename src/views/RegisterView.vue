<script setup>
  import { Form, useField, Field } from 'vee-validate';
  import * as Yup from 'yup';

  import { useAuthStore } from '@/stores';

  const schema = Yup.object().shape({
    email: Yup.string().email().required('Email is required').label("Email Address"),
    username: Yup.string().min(4).required('Username is required').label("Username"),
    password: Yup.string().min(6).required('Password is required').label("Your Password"),
    passwordConfirmation: Yup.string().required().oneOf([Yup.ref('password')], 'Passwords do not match'),
  });

  const email = useField('email')
  const password = useField('password')
  const username = useField('username')
  const passwordConfirmation = useField('passwordConfirmation')


  const submit = (values, { setErrors }) => {
    const authStore = useAuthStore();
    const { username, email, password, passwordConfirmation } = values;

    return authStore.register(username, email, password, passwordConfirmation)
      .catch(error => setErrors({ apiError: error }));
  }

</script>

<template>
  <v-container class="py-10 px-6" fluid>
    <v-card width="33vw" class="mx-auto pa-4" color="surface">
      <h2 class="text-h4 mb-2 font-weight-medium">Register</h2>
      <Form @submit="submit" :validation-schema="schema" v-slot="{ errors, isSubmitting }">
        <div class="form-row">
          <div class="form-group col">
            <label>Username</label>
            <Field name="username" v-model="username.value.value" class="form-control"
              :class="{ 'is-invalid': errors.username }">
            </Field>
            <div class="invalid-feedback">{{ errors.username }}</div>
          </div>
        </div>
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
        <div class="form-row">
          <div class="form-group col">
            <label>Confirm Your Password</label>
            <Field name="passwordConfirmation" v-model="passwordConfirmation.value.value" type="password"
              class="form-control" :class="{ 'is-invalid': errors.passwordConfirmation }">
            </Field>
            <div class="invalid-feedback">{{ errors.passwordConfirmation }}</div>
          </div>
        </div>
        <v-btn variant="flat" color="tertiary" class="me-4" type="submit" :disabled="isSubmitting">
          <v-progress-linear v-show="isSubmitting" indeterminate color="yellow-darken-2"></v-progress-linear>
          Register
        </v-btn>

        <div v-if="errors.apiError" class="alert alert-danger mt-3 mb-0">{{ errors.apiError }}</div>
      </Form>
    </v-card>
  </v-container>
</template>
