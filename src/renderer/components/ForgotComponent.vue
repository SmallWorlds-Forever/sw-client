<template>
  <v-row justify="center" no-gutters>
    <v-col cols="6">
      <v-card
        class="mx-auto"
        height="100"
        max-width="200"
        color="transparent"
        elevation="0"
      ></v-card>
      <v-row>
        <v-card
          color="transparent"
          elevation="0"
          class="px-8 pb-12 mx-auto mt-5"
        >
          <v-card
            color="transparent"
            elevation="0"
            class="px-8 pb-12 mx-auto"
          ></v-card>

          <h1 class="display-1 font-weight-thin mb-4">Forgot your password?<br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; No worries!</h1>
          <v-card
            color="transparent"
            elevation="0"
            class="px-8 pb-12 mx-auto"
          ></v-card>

          <!-- Email Stage -->
          <div v-if="stage === 'email'">
            <p class="subtitle-1 font-weight-thin mb-4">Enter your email address and we'll send you a verification code.</p>
            <v-form ref="emailForm" v-model="formValid" @submit.prevent="submitEmail">
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="Email"
                required
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
                :disabled="loading"
              ></v-text-field>
              
              <v-row>
                <v-col cols="12" class="text-sm-right">
                  <v-btn 
                    variant="text" 
                    color="green" 
                    type="submit" 
                    block
                    :loading="loading"
                    :disabled="!formValid || loading"
                  >
                    Send Reset Link
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </div>

          <!-- Verification Stage -->
          <div v-else-if="stage === 'verify'">
            <p class="subtitle-1 font-weight-thin mb-4">Please enter the verification code that was sent to your email.</p>
            <v-form ref="verifyForm" v-model="formValid" @submit.prevent="submitCode">
              <v-text-field
                v-model="verificationCode"
                :rules="codeRules"
                label="Verification Code"
                required
                prepend-inner-icon="mdi-lock-outline"
                variant="outlined"
                :disabled="loading"
              ></v-text-field>
              
              <v-row>
                <v-col cols="12" class="text-sm-right">
                  <v-btn 
                    variant="text" 
                    color="green" 
                    type="submit" 
                    block
                    :loading="loading"
                    :disabled="!formValid || loading"
                  >
                    Verify Code
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </div>

          <!-- Reset Password Stage -->
          <div v-else-if="stage === 'reset'">
            <p class="subtitle-1 font-weight-thin mb-4">Create a new password for your account.</p>
            <v-form ref="resetForm" v-model="formValid" @submit.prevent="submitNewPassword">
              <v-text-field
                v-model="password"
                :rules="passwordRules"
                label="New Password"
                :type="showPassword ? 'text' : 'password'"
                required
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
                variant="outlined"
                class="mb-3"
                :disabled="loading"
              ></v-text-field>
              
              <v-text-field
                v-model="confirmPassword"
                :rules="[...passwordRules, passwordMatchRule]"
                label="Confirm New Password"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                prepend-inner-icon="mdi-lock-check-outline"
                :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showConfirmPassword = !showConfirmPassword"
                variant="outlined"
                class="mb-3"
                :disabled="loading"
              ></v-text-field>
              
              <v-row>
                <v-col cols="12" class="text-sm-right">
                  <v-btn 
                    variant="text" 
                    color="green" 
                    type="submit" 
                    block
                    :loading="loading"
                    :disabled="!formValid || loading"
                  >
                    Reset Password
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </div>

          <!-- Success Stage -->
          <div v-else-if="stage === 'success'">
            <v-alert
              type="success"
              variant="tonal"
              text="Your password has been successfully reset."
              class="mb-4"
            ></v-alert>
            
            <v-row>
              <v-col cols="12" class="text-sm-right">
                <v-btn 
                  variant="text" 
                  color="green" 
                  block
                  @click="redirectToLogin"
                >
                  Return to Login
                </v-btn>
              </v-col>
            </v-row>
          </div>

          <v-row>
            <v-col cols="12">
              <v-btn 
                variant="text" 
                color="blue" 
                to="login" 
                block
                :disabled="loading"
                v-if="stage != 'success'"
              >
                Return to Login
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-row>
    </v-col>
    <v-col cols="6">
      <v-img
        src="intro.png"
        style="height: -webkit-fill-available"
        alt="Forgot Password"
      />
    </v-col>
  </v-row>

  <!-- Error Snackbar -->
  <v-snackbar
    v-model="showError"
    :color="snackbarColor"
    :timeout="5000"
    bottom
  >
    {{ errorMessage }}
    <template v-slot:actions>
      <v-btn
        color="white"
        icon
        @click="showError = false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'ForgotComponent',
  emits: ['triggerSnackbar'],

  setup() {
    const router = useRouter();
    
    // Form validation
    const formValid = ref(false);
    const emailForm = ref(null);
    const verifyForm = ref(null);
    const resetForm = ref(null);
    
    // Form fields
    const email = ref('');
    const verificationCode = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    
    // Show/hide password
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);
    
    // UI state
    const loading = ref(false);
    const stage = ref('email'); // email → verify → reset → success
    const errorMessage = ref('');
    const showError = ref(false);
    const snackbarColor = ref('error');
    
    // Validation rules
    const emailRules = [
      v => !!v || 'Email is required',
      v => /.+@.+\..+/.test(v) || 'Email must be valid'
    ];
    
    const codeRules = [
      v => !!v || 'Verification code is required',
      v => v.length >= 6 || 'Code must be at least 6 characters'
    ];
    
    const passwordRules = [
      v => !!v || 'Password is required',
      v => v.length >= 8 || 'Password must be at least 8 characters',
      v => /[A-Z]/.test(v) || 'Password must contain at least one uppercase letter',
      v => /[0-9]/.test(v) || 'Password must contain at least one number',
      v => /[!@#$%^&*(),.?":{}|<>]/.test(v) || 'Password must contain at least one special character'
    ];
    
    const passwordMatchRule = value => value === password.value || 'Passwords do not match';
    
    // Methods
    const showSnackbar = (message, color = 'error') => {
      errorMessage.value = message;
      snackbarColor.value = color;
      showError.value = true;
    };
    
    const resetForms = () => {
      if (emailForm.value) emailForm.value.reset();
      if (verifyForm.value) verifyForm.value.reset();
      if (resetForm.value) resetForm.value.reset();
      formValid.value = false;
    };
    
    const redirectToLogin = () => {
      router.push('/login');
    };
    
    const submitEmail = async () => {
      if (!formValid.value) return;
      
      loading.value = true;
      
      try {
        const response = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email.value }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Move to verification code stage
          stage.value = 'verify';
          showSnackbar('Verification code sent to your email', 'success');
        } else {
          showSnackbar(data.message || 'Failed to send reset email');
        }
      } catch (error) {
        console.error('Error sending reset email:', error);
        showSnackbar('An error occurred. Please try again later.');
      } finally {
        loading.value = false;
      }
    };
    
    const submitCode = async () => {
      if (!formValid.value) return;
      
      loading.value = true;
      
      try {
        const response = await fetch('/api/auth/verify-reset-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email: email.value,
            code: verificationCode.value 
          }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Move to password reset stage
          stage.value = 'reset';
        } else {
          showSnackbar(data.message || 'Invalid verification code');
        }
      } catch (error) {
        console.error('Error verifying code:', error);
        showSnackbar('An error occurred. Please try again later.');
      } finally {
        loading.value = false;
      }
    };
    
    const submitNewPassword = async () => {
      if (!formValid.value) return;
      
      loading.value = true;
      
      try {
        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.value,
            code: verificationCode.value,
            password: password.value
          }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Show success screen
          stage.value = 'success';
          showSnackbar('Password successfully reset', 'success');
        } else {
          showSnackbar(data.message || 'Failed to reset password');
        }
      } catch (error) {
        console.error('Error resetting password:', error);
        showSnackbar('An error occurred. Please try again later.');
      } finally {
        loading.value = false;
      }
    };

    return {
      // Form refs and validation
      emailForm,
      verifyForm,
      resetForm,
      formValid,
      
      // Form fields
      email,
      verificationCode,
      password,
      confirmPassword,
      
      // Validation rules
      emailRules,
      codeRules,
      passwordRules,
      passwordMatchRule,
      
      // UI state
      loading,
      stage,
      errorMessage,
      showError,
      snackbarColor,
      showPassword,
      showConfirmPassword,
      
      // Methods
      submitEmail,
      submitCode,
      submitNewPassword,
      redirectToLogin,
      showSnackbar,
    };
  }
};
</script>

<style scoped>
/* Add any custom styles here */
.display-1 {
  font-size: 2.5rem;
  line-height: 3rem;
  color: white;
}

.subtitle-1 {
  font-size: 1rem;
  line-height: 1.5rem;
  color: rgba(255, 255, 255, 0.8);
}
</style>