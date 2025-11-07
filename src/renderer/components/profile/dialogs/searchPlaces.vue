<template>
    <v-dialog
      v-model="dialog"
      max-width="500"
      :persistent="isSaving"
    >
        <v-card class="sw-dialog">
            <v-card-title class="sw-dialog-header">
                Find Friends
                <v-btn
                  icon
                  color="white darken-1"
                  class="swCloseBtn"
                  @click="close"
                  variant="tonal"
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <p>Find friends to play with.</p>
                <br>
                <p>Enter the username of the friend you want to find:</p>
                <v-text-field
                  v-model="username"
                  label="Username"
                  outlined
                  dense
                ></v-text-field>
            </v-card-text>
            <v-card-actions class="sw-dialog-actions">
                <v-spacer></v-spacer>
                <v-btn
                  class="swBtn"
                  :loading="isSaving"
                  @click="findFriends"
                >Find</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Object,
      default: () => ({}),
      required: true,
    },
  },
  
  data() {
    return {
      dialog: false,
      username: '',
      isSaving: false,
    };
  },
  emits: ['close'],
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
  methods: {
    close() {
        this.$emit('close');
      
    },
    findFriends() {
      this.isSaving = true;
      // Simulate an API call
      setTimeout(() => {
        this.isSaving = false;
        this.close();
      }, 2000);
    },
  },
};
</script>