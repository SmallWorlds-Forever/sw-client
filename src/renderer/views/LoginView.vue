<template>
    <LoginComponent @triggerSnackbar="triggerSnackbar" />
</template>

<script>
import LoginComponent from '@components/LoginComponent.vue';
import { useMeta } from 'vue-meta';
export default {
  name: 'LoginView',
  setup () {
    useMeta({ title: 'Login' })
  },
  components: {
    LoginComponent,
  },
  emits: ['triggerSnackbar'],
  methods: {
    triggerSnackbar(data) {
      this.$emit('triggerSnackbar', data);
    },
  },
};
</script>
