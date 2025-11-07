<template>
  <v-dialog scrollable v-model="vdia" persistent
>
<v-card>
  <v-toolbar
          dark
          color="info"
        >
        <v-card-title>Navigating Away</v-card-title>
        </v-toolbar>
        <v-divider></v-divider>
        <v-container fluid>
          <v-list
          lines="one"
        >
          <v-list-item title="Are you sure?" subtitle="You are about to leave the current space you are in."></v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list
          lines="one"
        >
          <v-list-item title="Do not show again" subtitle="Remember my option, to never see this dialog again.">
            <template v-slot:prepend>
              <v-checkbox v-model="forget"></v-checkbox>
            </template>
          </v-list-item>
        </v-list>
  </v-container>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="blue-darken-1" variant="text" @click="vdia = false">
            Cancel
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="proceed">
            Continue
          </v-btn>
        </v-card-actions>
      </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'dialogAway',
  data() {
      return {
        forget: false,
        dia: false,
        url: '',
      }
    },
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
    proceed() {
      if (this.forget){
        // window.frame.rememberNavigation();
        localStorage.setItem('rememberNavigation', true);
      }
      this.$emit('close');
      this.$router.push({ name: this.content.url });
    },
  },
  computed: {
    vdia: {
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
  watch: {
    content(val) {
      this.url = val.url;
    },
    // visible(val) {
    //   this.vdia = val;
    // },
  },
};
</script>
<style>
.v-overlay__content {
  align-items: center;
}
</style>
