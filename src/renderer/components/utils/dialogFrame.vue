<template>
  <v-dialog v-model="dialog">
    <v-card
      :width="content.width"
      :height="content.height"
      v-click-outside="onClickOutside"
    >
      <!-- <v-btn color="primary" dark @click.stop="dialog = false" /> -->
      <iframe
        ref="iframe"
        :src="content.url"
        frameborder="0"
        style="
          overflow: hidden;
          height: 100%;
          width: 100%;
          align-content: center;
          justify-content: center;
          align-items: center;
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
          flex: 1;
          margin: 0;
        "
      />
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'vDialog',
  props: {
    visible: {
      type: Boolean,
      required: true,
      default: false,
    },
    content: {
      type: Object,
      required: true,
    },
  },
  methods: {
    onClickOutside() {
      //close dialog
      this.$emit('close');
      this.$refs.iframe.src = '';
    },
  },
  computed: {
    dialog: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit('close');
        }
      },
    },
  },
};
</script>
<style>
.v-overlay__content {
  align-items: center;
}
</style>
