<template>
  <v-dialog v-model="dialog" max-width="500" :persistent="isCreating">
    <v-card class="sw-dialog">
      <v-card-title class="sw-dialog-header">
        Create Avatar
        <v-btn
          icon
          color="white darken-1"
          class="swCloseBtn"
          @click="close"
          variant="tonal"
          :disabled="isCreating"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <!-- Image Selection -->
        <div class="image-selection">
          <div
            v-for="(image, index) in images"
            :key="index"
            :class="['selectable-image', { selected: selectedImage === index }]"
            @click="selectImage(index)"
            :disabled="isCreating"
          >
            <div class="avatar-image" :class="image.class"></div>
          </div>
        </div>
        <!-- Name Inputs and Generate Button -->
        <div class="name-inputs">
          <v-text-field
            label="First Name"
            v-model="firstName"
            hide-details
            variant="outlined"
            class="firstName"
            :class="{ 'is-available': nameAvailable }"
            :disabled="isCreating"
          />
          <v-text-field
            label="Last Name"
            v-model="lastName"
            hide-details
            variant="outlined"    
            class="lastName"
            :class="{ 'is-available': nameAvailable }"
            :disabled="isCreating"        
          />
          <!-- Random icon btn -->
          <v-btn
            icon
            small
            @click="generateNames"
            class="glassBtn"
            :disabled="selectedImage === null || isCreating"
          >
            <v-icon>mdi-dice-5-outline</v-icon>
          </v-btn>
        </div>
        <!-- New name availability message section -->
        <div v-if="firstName && lastName" class="name-message" :class="{
          'success': nameAvailable,
          'warning': nameAvailable && nameMessage && nameMessage.includes('the'),
          'error': !nameAvailable && nameMessage
        }">
          <v-icon class="mr-1" :icon="nameAvailable ? 'mdi-check-circle' : 'mdi-alert-circle'"></v-icon>
          {{ nameMessage }}
        </div>
      </v-card-text>
      <v-card-actions class="sw-dialog-actions">
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-btn 
          color="white" 
          class="swBtn flex-grow-1" 
          text 
          @click="save"
          :loading="isCreating"
          :disabled="isCreating || !nameAvailable || selectedImage === null"
        >
          Create
        </v-btn>
      </v-card-actions>
      
      <!-- Loading overlay -->
      <v-overlay
        v-if="isCreating"
        class="align-center justify-center"
        contained
        :value="isCreating"
      >
        <div class="text-center">
          <v-progress-circular
            indeterminate
            color="#0099cc"
            size="64"
          ></v-progress-circular>
          <div class="mt-4 white--text">Creating your avatar...</div>
        </div>
      </v-overlay>
    </v-card>
  </v-dialog>
</template>

<script>
import { faker } from '@faker-js/faker';
export default {
  name: "CreateAvatar",
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['close', 'save', 'checkNameAvailability'],
  data() {
    return {
      images: [
        { class: "avatar-male" },
        { class: "avatar-female" },
      ],
      selectedImage: null,
      firstName: "",
      lastName: "",
      nameAvailable: false,
      nameMessage: "",
      isCreating: false,
      nameCheckTimeout: null, // add this to debounce name checks
    };
  },
  computed: {
    dialog: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.close();
        }
      },
    },
  },
  watch: {
    firstName(newVal) {
      if (newVal && this.lastName) {
        this.debounceNameCheck();
      } else {
        this.nameMessage = "";
      }
    },
    lastName(newVal) {
      if (newVal && this.firstName) {
        this.debounceNameCheck();
      } else {
        this.nameMessage = "";
      }
    },
  },
  methods: {
    selectImage(index) {
      if (!this.isCreating) {
        this.selectedImage = index;
      }
      if (this.firstName && this.lastName) {
        this.generateNames();
      }
    },
    generateNames() {
      if (this.selectedImage === null || this.isCreating) {
        return;
      }

      const isMale = this.images[this.selectedImage].class === "avatar-male";

      this.firstName = faker.person.firstName(isMale ? 'male' : 'female');
      this.lastName = faker.person.lastName();
    },
    close() {    
      if (!this.isCreating) {
        // clear the form
        this.firstName = "";
        this.lastName = "";
        this.selectedImage = null;
        this.nameAvailable = false;
        this.nameMessage = "";
        this.$emit("close");
      }
    },
    debounceNameCheck() {
      clearTimeout(this.nameCheckTimeout);
      this.nameMessage = "Checking availability...";
      
      this.nameCheckTimeout = setTimeout(async () => {
        if (!this.firstName || !this.lastName) {
          this.nameAvailable = false;
          this.nameMessage = "";
          return;
        }
        
        // Use parent's method via emit
        this.$emit('checkNameAvailability', {
          firstName: this.firstName,
          lastName: this.lastName,
          callback: this.handleNameCheckResult
        });
      }, 300);
    },
    handleNameCheckResult(result) {
      this.nameAvailable = result.isAvailable;
      
      if (result.isAvailable) {
        if (result.nameInstance === 1) {
          this.nameMessage = "Name is available!";
        } else {
          this.nameMessage = `Name is taken. It will be modified to "${result.ordinalName}"`;
        }
      } else {
        this.nameMessage = result.message || "This name isn't available";
      }
    },
    finishSaving(error = null) {
      this.isCreating = false;
      if (!error)
      {
        // reset the form
        this.firstName = "";
        this.lastName = "";
        this.selectedImage = null;
        this.nameAvailable = false;
        this.nameMessage = "";
        this.close();
      }
    },
    async save() {
      if (!this.nameAvailable || this.selectedImage === null || this.isCreating) {
        return;
      }
      
      this.isCreating = true;
      
      try {
        // Create data object to emit
        const avatarData = {
          firstName: this.firstName,
          lastName: this.lastName,
          gender: this.images[this.selectedImage].class === "avatar-male" ? "M" : "F"
        };
        
        // Emit the save event with the data
        this.$emit('save', avatarData);
        
        // Wait a bit to show loading state
        // In a real scenario, the parent component should handle closing the dialog
        // only after the API call is complete
      } catch (error) {
        console.error('Error creating avatar:', error);
      } finally {
        this.isCreating = false;
      }
    },
  },
};
</script>

<style scoped>
.image-selection {
  display: flex;
  justify-content: space-around;
  margin-bottom: 16px;
}

.selectable-image {
  padding: 4px;
  cursor: pointer;
}

/* Add border only when selected */
.selectable-image.selected {
  border: 2px solid orange; /* Adjust color as needed */
  border-radius: 4px; /* Optional: Add rounded corners */
  /* change filter to white but dont effect the border */
}
.selectable-image.selected .avatar-image {
  filter: brightness(0) invert(1);
}

.name-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Avatar Image Styling */
.avatar-image {
  width: 55px;
  height: 200px;
  background-repeat: no-repeat;
}

.avatar-female {
  background-image: url("/images/avatar_female.png"); /* Path to your image */
  background-position: 0 0;
}

.avatar-female.selected {
  filter: brightness(0) invert(1);
}

.avatar-male {
  background-image: url("/images/avatar_male.png"); /* Path to your normal male avatar */
  background-position: 0 0;
}

.avatar-male.selected {
  filter: brightness(0) invert(1);
}

.createDialog {
  width: 500px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #0099cc, #00c6ff);
}

.dialog-header {
  position: relative;
  background: linear-gradient(135deg, #0099cc, #00c6ff);
  color: white;
  font-size: 14px;
  font-weight: 600;
  /* make capital */
  text-transform: uppercase;
  /* padding: 10px; */
  border-bottom: 3px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dialog-content {
  padding: 20px;
}

.is-available.v-field__outline {
  color: #10e110 !important;
  /* text color */
}

/* Style for the name available message */
.name-message {
  margin-top: 12px;
  padding: 8px 12px;
  border-radius: 4px;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.name-message.success {
  background-color: rgba(76, 175, 80, 0.1);
  color: #2e7d32;
  border-left: 3px solid #2e7d32;
}

.name-message.warning {
  background-color: rgba(255, 193, 7, 0.096);
  color: #ffad09;
  font-weight: 500;
  border-left: 3px solid #ff8f00;
}

.name-message.error {
  background-color: rgba(244, 67, 54, 0.1);
  color: #c62828;
  border-left: 3px solid #c62828;
}

/* Style for loading overlay */
.v-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex !important;
}
</style>