<template>
    
    <v-dialog v-model="dialog" max-width="500" :persistent="isDeleting">
        <v-card class="sw-dialog">
            <v-card-title class="sw-dialog-header">
                Delete Avatar
                <v-btn icon color="white darken-1" class="swCloseBtn" @click="close" variant="tonal" :disabled="isDeleting">
          <v-icon>mdi-close</v-icon>
        </v-btn>
            </v-card-title>
            <v-card-text>
                <p>Are you sure you want to delete {{user.fullName}}?</p>
                <br>
                <p>This action cannot be undone.</p>
                <br>
                <!-- Show 3 -->
            </v-card-text>
            <v-card-actions class="sw-dialog-actions">
                <v-spacer></v-spacer>
                <v-btn class="swBtn" :loading="isDeleting" @click="deleteAvatar">Delete</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    name: "DeleteAvatar",
    props: {
        visible: {
        type: Boolean,
        required: true,
        },
        user: {
        type: Object,
        default: () => ({}),
        validator: (value) => {
            return (
            value.hasOwnProperty('fullName') 
            );
        },
        required: true,
        },

    },
    emits: ['close', 'delete'],
    data() {
        return {
        isDeleting: false,
        };
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
    methods: {
        deleteAvatar() {
        this.isDeleting = true;
        this.$emit('delete');
        },
        close() {
      if (!this.isDeleting) {
        this.$emit('close');}
        },
        finishDelete() {
            this.isDeleting = false;
            this.$emit('close');
        },

    },
    
    };

</script>
    