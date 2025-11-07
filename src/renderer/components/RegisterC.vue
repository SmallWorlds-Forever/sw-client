<template>
  <v-btn color="primary" dark @click="close" />
</template>
<script>
export default {
  name: 'RegisterC',
  methods: {
    close() {
      window.close();
    },
  },
};
</script>
