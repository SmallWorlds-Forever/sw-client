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

          <h1 class="display-1 font-weight-thin mb-4">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Join Now</h1><h2 class="display-1 font-weight-thin mb-4"> Your digital journey awaits!</h2>
          <v-card
            color="transparent"
            elevation="0"
            class="px-8 pb-12 mx-auto"
          ></v-card>

          <v-card-title class="text-center">
         
          </v-card-title>

          <v-form @submit.prevent="checkInvite">
            <v-text-field
              v-model="code"
              label="Invite Code"
              type="text"
              :rules="codeRules"
              required
              variant="outlined"
              prepend-inner-icon="mdi-lock-check-outline"
              ref="code"
            />
          </v-form>
          <v-row>
            <v-col sm="5" text-sm-right>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="text-sm-right">
                <v-btn variant="text" color="green" type="submit" block  @click="checkInvite"
                >Proceed</v-btn
                >
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-btn variant="text" color="blue" to="login" block
                >Return to Login</v-btn
              >
            </v-col>
          </v-row>
        </v-card>
      </v-row>
      <v-row justify="center" no-gutters>
        <v-btn
          icon
          class="mx-auto"
          href="discord://-/invite/"
        >
        <i class="fa-brands fa-discord"></i>
      </v-btn>
      </v-row>
    </v-col>
    <v-col cols="6">
      <v-img
        src="intro.png"
        style="height: -webkit-fill-available"
        alt="Welcome"
      />
    </v-col>
  </v-row>
  <vdialog :visible="showDialog" :content="panel" />
</template>

<script>
import vdialog from '@/components/utils/dialogFramePers.vue';
import { useAuthStore } from '@stores/auth';
import { reactive } from 'vue';
const auth = useAuthStore();
export default {
  name: 'LoginComponent',
  components: {
    vdialog,
  },
  emits: ['triggerSnackbar'],
  data: () => ({
    showDialog: false,
    panel: {
      url: '',
      width: 0,
      height: 0,
    },
    credentials: reactive({
      email: '',
      password: '',
      remember: false,
    }),
    code: '',
    password: '',
    //grab data.url from api link and set image
    img: '',
    codeRules: [
      (value) => {
        if (value) return true;

        return 'Code is required.';
      },
      // (value) => {

      //   return 'code must be valid.';
      // },
    ],
    passwordRules: [
      (value) => {
        if (value) return true;

        return 'Password is required.';
      },
      (value) => {
        if (value.length >= 8) return true;

        return 'Password must be at least 8 characters.';
      },
    ],
  }),

  methods: {
    async checkInvite() {
      // validate codeRules
      if (!this.code) {
        this.$refs.code.focus();
        this.$refs.code.validate();
        return;
      }
      
      fetch('/api/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: this.code,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // this.$router.push({
            //   name: 'Register',
            //   params: { code: this.code },
            // });
            // window.frame.register(this.code);
            this.showDialog = true;
            this.panel.url = import.meta.env.VITE_API_URL + '/code/' + this.code;
            this.panel.width = 680;
            this.panel.height = 725;
          } else {
            this.$emit('triggerSnackbar', {
              visible: true,
              text: data.message,
              color: 'red',
              icon: 'mdi-alert-circle',
              timeout: 5000,
            });
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      
    },
    async closeDialog(event) {
      if(event.origin !== import.meta.env.VITE_API_URL) return; 
      this.credentials.id = event.data.data.token;
      if (await auth.loginWithToken(this.credentials.id)) {
          this.showDialog = false;
        }
        window.location.reload();
    },
  },

  mounted() {
    window.addEventListener('message', this.closeDialog, false);
  },
};
</script>
