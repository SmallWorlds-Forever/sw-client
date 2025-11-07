<template>
    <v-dialog v-model="dialog">
    <v-card
      :width="content.width"
      :height="content.height"
      v-click-outside="onClickOutside"
    >
    <object class="gameFrame" height="100%" width="100%" type="application/x-shockwave-flash" :data=content.flash :id=content.panelName :name=content.panelName>
      <param name="menu" value="false">
      <param name="quality" value="high">
      <param name="movie" :value="content.flash">
      <param name="bgcolor" value="#e1e1e1">
      <param name="flashvars" :value="content.flashvars">
      <param name="allowScriptAccess" value="always">
      <param name="allowFullScreen" value="true">
      <param name="wmode" value="window">
    </object>
  </v-card>
</v-dialog>
  </template>
  
  <script>
  import { defineComponent, watch } from 'vue';
  import router from '@/router';
  import { useAuthStore} from '@/stores/auth.js';
  import { useGameStore } from '@/stores/game.js';
  const auth = useAuthStore();
  const game = useGameStore();

  export default defineComponent({
    name: 'dialogFlash',
    props: {
      visible: {
      type: Boolean,
      required: true,
      default: false,
    },
    content: {
      type: Object,
      required: true,
      default: () => ({
        width: 800,
        height: 600,
        panelName: '',
      }),
    },
    },
    methods: {
    onClickOutside() {
      //close dialog
      this.$emit('close');
      // this.$refs.iframe.src = '';
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
    setup() {
      watch(auth, () => {
        if (!auth.loggedIn) {
          router.push({ name: 'login' });
        }
      });
      return {
        auth,
        game,
      };
    },
  });
  </script>

<style>
.v-overlay__content {
  align-items: center;
}
</style>