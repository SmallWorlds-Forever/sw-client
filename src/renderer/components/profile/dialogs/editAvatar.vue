<template>
  <v-dialog
    v-model="dialog"
    max-width="500"
    :persistent="isSaving"
  >
    <v-card class="sw-dialog">
      <v-card-title class="sw-dialog-header">
        Edit Avatar
        <v-btn icon color="white darken-1" class="swCloseBtn" @click="close" variant="tonal" :disabled="isSaving">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="sw-dialog-content">
        <v-form ref="form">
          <v-container>
            <v-row>
              <v-col cols="6">
                <v-text-field 
                  v-model="firstName" 
                  label="First Name" 
                  required
                  dense
                  variant="outlined"
                  :disabled="isSaving"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field 
                  v-model="lastName" 
                  label="Last Name" 
                  required
                  dense
                  variant="outlined"
                  :disabled="isSaving"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="12">
                <v-radio-group v-model="gender" mandatory inline label="Gender" :disabled="isSaving">
                  <v-radio label="Male" value="male"></v-radio>
                  <v-radio label="Female" value="female"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row v-if="isAdminComputed" justify="center">
              <v-col cols="12" class="d-flex justify-end">
                <v-btn
                  color="#0099cc"
                  @click="showXML = !showXML"
                  size="small"
                  class="mb-2"
                  :disabled="isSaving"
                >
                  {{ showXML ? 'Hide XML' : 'Show XML' }}
                  <v-icon right>
                    {{ showXML ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                  </v-icon>
                </v-btn>
              </v-col>
              <v-col cols="12" v-if="showXML">
                <v-textarea 
                  v-model="configXML" 
                  label="Config XML"
                  dense
                  variant="solo-filled"
                  auto-grow
                  class="xml-textarea"
                  :disabled="isSaving"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
        <div v-if="firstName && lastName && hasNameChanges" class="name-message" :class="{
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
        <v-btn 
          color="darken-1" 
          class="swBtn flex-grow-1" 
          @click="save" 
          variant="flat"
          :loading="isSaving"
          :disabled="isSaving || !hasChanges"
        >
          Save
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
      
      <!-- Loading overlay that covers the entire dialog -->
      <v-overlay
        v-if="isSaving"
        class="align-center justify-center"
        contained
        :value="isSaving"
      >
        <v-progress-circular
          indeterminate
          color="#0099cc"
          size="64"
        ></v-progress-circular>
      </v-overlay>
    </v-card>
  </v-dialog>
</template>

<script>
import { useUserStore } from '@/stores/user.js';
import { useAuthStore } from '@/stores/auth.js';

export default {
  name: 'EditAvatarDialog',
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
  emits: ['close', 'saveAvatarChanges', 'checkNameAvailability'],
  data() {
    return {
      firstName: '',
      lastName: '',
      gender: 'male',
      configXML: '',
      showXML: false,
      isSaving: false,
      id: null,
      nameAvailable: false,
      nameMessage: "",
      nameCheckTimeout: null,
      originalFirstName: '',
      originalLastName: '',
      originalGender: '',
      originalConfigXML: '',
    };
  },
  computed: {
    isAdminComputed() {
      const auth = useAuthStore();
      return (
        auth.primaryGroupId === 1 ||
        auth.primaryGroupId === 2 ||
        auth.primaryGroupId === 13 ||
        auth.secondaryGroupIds.includes(13)
      );
    },
    hasChanges() {
      return this.firstName !== this.originalFirstName ||
             this.lastName !== this.originalLastName ||
             this.gender !== this.originalGender ||
             (this.isAdminComputed && this.configXML !== this.originalConfigXML);
    },
    hasNameChanges() {
      return this.firstName !== this.originalFirstName || 
             this.lastName !== this.originalLastName;
    },
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
  watch: {
    user: {
      handler(newVal) {
        if (newVal) {
          this.firstName = newVal.firstName || '';
          this.lastName = newVal.lastName || '';
          this.gender = newVal.gender || '';
          this.configXML = newVal.configXML || '';
          this.id = newVal.id || null;
          this.nameInstance = newVal.nameInstance || '';
          this.originalFirstName = newVal.firstName || '';
          this.originalLastName = newVal.lastName || '';
          this.originalGender = newVal.gender || '';
          this.originalConfigXML = newVal.configXML || '';
        }
      },
      immediate: true,
    },
    firstName(newVal) {
      if (this.hasNameChanges) {
        this.debounceNameCheck();
      } else {
        this.nameAvailable = true;
        this.nameMessage = "";
      }
    },
    lastName(newVal) {
      if (this.hasNameChanges) {
        this.debounceNameCheck();
      } else {
        this.nameAvailable = true;
        this.nameMessage = "";
      }
    },
    gender(newVal) {

      if (newVal === 'male') {
      // Change from female to male
      this.configXML = this.configXML.replace(/<avatar\s+gender="female"/g, '<avatar gender="male"');
    } else if (newVal === 'female') {
      // Change from male to female
      this.configXML = this.configXML.replace(/<avatar\s+gender="male"/g, '<avatar gender="female"');
    }
    },
  },
  methods: {
    close() {
      if (!this.isSaving) {
        this.$emit('close');
      }
      

    },
    finishSaving(error = null) {
      this.isSaving = false;

      if (!error) {
        //show msg 
        // Successfully saved, now close the dialog
        // update the original values to the new values
        this.originalFirstName = this.firstName;
        this.originalLastName = this.lastName;
        this.originalGender = this.gender; 
        this.originalConfigXML = this.configXML;
        this.close();
      } 
      // clear the form to default values
      this.firstName = this.originalFirstName;
      this.lastName = this.originalLastName; 
      this.gender = this.originalGender;
      this.configXML = this.originalConfigXML;
      
    },
    debounceNameCheck() {
      clearTimeout(this.nameCheckTimeout);
      this.nameMessage = "Checking availability...";
      
      this.nameCheckTimeout = setTimeout(() => {
        if (!this.firstName || !this.lastName) {
          this.nameAvailable = false;
          this.nameMessage = "";
          return;
        }
        
        // Skip check if names haven't changed
        if (!this.hasNameChanges) {
          this.nameAvailable = true;
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
    async save() {
      // Check if name is available before saving
      if (this.hasNameChanges && !this.nameAvailable) {
        return;
      }
      
      this.isSaving = true;
      
      try {
        // Create data object to emit
        const avatarData = {
          firstName: this.firstName,
          lastName: this.lastName,
          gender: this.gender,
          configXML: this.configXML,
          id: this.id,
          nameInstance: this.nameInstance,
        };
        
        // Emit the save event with the data
        // The parent component will handle the actual API call
        // show loading until the API call is complete
        if (this.$refs.form) {
          this.$refs.form.validate();
        }
        this.$emit('saveAvatarChanges', avatarData);
        // this.isSaving = false;
      } catch (error) {
        console.error('Error saving avatar from editAvatar.vue:', error);
        this.isSaving = false;
        
      } 
    },
  },
 
};
</script>

<style scoped>
.close-btn {
  position: absolute;
  right: 8px;
  top: 8px;
  color: white;
  font-size: 12px;
}

/* make close btn small */
.v-btn--icon {
  min-width: 32px;
  min-height: 32px;
  width: 32px;
  height: 32px;
  padding: 0;
}

.xml-textarea {
  font-family: monospace;
  white-space: pre-wrap;
  overflow-wrap: break-word;
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
</style>