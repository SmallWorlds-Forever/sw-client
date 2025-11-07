<template>
    <ForgotComponent />
</template>

<script>
import ForgotComponent from '@components/ForgotComponent.vue';
import { useMeta } from 'vue-meta';

export default {
  name: 'ForgotView',

  setup () {
    useMeta({ title: 'Forgot Password' })
  },

  components: {
    ForgotComponent,
  },
};
</script>
