<template>

  <v-snackbar
    v-model="show"
    :timeout="snackbar.timeout"
    :color="snackbar.color"
    :offset="snackbar.offset"
    rounded="pill"
    :variant="snackbar.variant"
    transition="true"
  >
  <v-icon class="float-left mr-2">{{ snackbar.icon }}</v-icon>
  <span class="justify">{{ snackbar.text }}</span>
  </v-snackbar>
</template>

<script>
export default {
  name: 'snackBar',
  props: {
    snackbar: {
      type: Object,
      required: true,
      default: () => ({
        visible: false,
        text: '',
        color: '',
        icon: '',
        timeout: 0,
        variant: 'tonal',
        offset: 0,
      }),
    },
  },
  computed: {
    show: {
      get() {
        return this.snackbar.visible;
      },
    },
  },
  
};
</script>
