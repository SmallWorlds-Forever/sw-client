<template>
  <!-- Login form -->

  <v-row justify="center" no-gutters>
    <!-- shift page down -->
    <v-col cols="6">
      <v-img aspect-ratio="1" class="white--text align-end">
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
            class="px-8 pb-12 mx-auto mt-5"
            elevation="0"
          >
            <!-- <v-card color="transparent" elevation="0" class="px-8 pb-12 mx-auto"> -->
            <v-card-title class="text-center">
              <v-avatar
                size="104"
                class="mb-5 text-center"
                :image="img"
                style="
                  background: #00000052;
                  border-radius: 50%;
                  border: solid #bbb 1px;
                "
              />
              <h4 class="display-1 font-weight-thin mb-4">Welcome to your digital journey. <br/>Where every login is a new adventure.</h4>
            </v-card-title>
            <!-- <p class="subheading font-weight-thin mb-4">
              Welcome back! Login to your account to continue.
            </p> -->

            <v-form @submit.prevent="handleLogin">
              <v-text-field
                v-model.trim="credentials.email"
                label="Email"
                type="email"
                :rules="emailRules"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                required
              />
              <v-text-field
                v-model="credentials.password"
                label="Password"
                type="password"
                :rules="passwordRules"
                required
                prepend-inner-icon="mdi-eye"
                variant="outlined"
                @keydown.enter="handleLogin"
              />
              <!-- remember me btn to left -->
              <!-- <v-col cols="12" sm="6" text-sm-left> -->
              <!-- <v-checkbox text-sm-left label="Remember me" color="primary" /> -->

              <!-- </v-col> -->
              <!--  -->
              <!-- remember me checkbox -->
              <div class="mb-4">
                <div class="d-flex justify-space-between align-center">
                  <!-- <v-checkbox label="Remember me" color="blue" v-model="credentials.remember"/> -->
                
                <!-- <v-col sm="5" text-sm-right> -->
                  <!-- make it align on same as remember me text -->
                   <!-- Forgot  -->
                    <router-link class="text-decoration-none text-primary text-body-2 font-weight-medium" to="/forgot" @click.stop >Forgot password?</router-link>
                <!-- </v-col> -->
              </div>
              </div>
              <v-row>
                <v-col cols="12" class="text-sm-right">
                  <v-btn variant="text" color="green" @click="handleLogin" block
                    >Login</v-btn
                  >
                </v-col>
              </v-row>
            </v-form>
            <v-row>
              <v-col cols="12">
                <v-btn variant="text" color="blue" to="invite" block
                  >Invite Code</v-btn
                >
              </v-col>
            </v-row>
          </v-card>
        </v-row>

                  
        
        <!-- add discord button in a v-card -->
        <v-row justify="center" no-gutters>
          <!-- <v-card
            color="transparent"
            elevation="0"
            class="mt-15"
          > -->
          <!-- icon button -->
          <!-- center it -->
          <v-btn
            icon
            class="mx-auto"
            href="discord://-/invite/"
          >
          <i class="fa-brands fa-discord"></i></v-btn>
          <!-- </v-card> -->
        </v-row>
        <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="10">
                <v-btn variant="text" color="blue" block
                  >Made with ♥️ in USA</v-btn>
                
              </v-col>
              <v-col cols="1"></v-col>
            </v-row>
      </v-img>
    </v-col>

    <!-- add an random image to the right -->

    <v-col cols="6">
      <v-img
        src="intro.png"
        style="height: -webkit-fill-available"
        alt="Welcome"
      />
    </v-col>
  </v-row>
  <snackBar :snackbar="snackbar" />
</template>

<script>
import { reactive } from 'vue';
import { useAuthStore } from '@stores/auth';
import snackBar from '@components/utils/snackBar.vue';
import { toRaw } from 'vue';
// import { JSON } from 'core-js';
const auth = useAuthStore();
export default {
  name: 'LoginComponent',
  components: {
    snackBar,
  },
  data: () => ({
    session: '',
    snackbar: {
      visible: false,
      text: '',
      color: '',
      icon: '',
      timeout: null,
      offset: '',
    },
    //grab data.url from api link and set image
    credentials: reactive({
      email: '',
      password: '',
      remember: false,
    }),
    doInterval: true,
    img: '',
    emailRules: [
      (value) => {
        if (value) return true;

        return 'E-mail is required.';
      },
      (value) => {
        if (/.+@.+\..+/.test(value)) return true;

        return 'E-mail must be valid.';
      },
    ],
    passwordRules: [
      (value) => {
        if (value) return true;

        return 'Password is required.';
      },
      (value) => {
        if (value.length >= 6) return true;

        return 'Password must be at least 6 characters.';
      },
    ],
  }),

  methods: {
    triggerSnackbar(data) {
      this.snackbar.visible = data.visible;
      this.snackbar.text = data.text;
      this.snackbar.color = data.color;
      this.snackbar.icon = data.icon;
      this.snackbar.timeout = data.timeout;
      this.snackbar.offset = data.offset;
      setTimeout(() => {
        this.snackbar.visible = false;
      }, this.snackbar.timeout);
    },

    checkSession()
    {

      window.storage.getItem('SWSID').then((value) => {
        this.session = toRaw(JSON.parse(value));
      });
      if (this.session.SWSID === null) return;
      // check if session.expires_at is not expired
      // if expired, remove SWSID from localstorage
      // if not expired, redirect to profile
      if (this.session.expires_at < Date.now()) {
        window.storage.removeItem('SWSID');
      } else {
        auth.isLogged = true;
        this.$router.push('/profile');
      }
    },

    async handleLogin() {
      // is email valid and password is at least 6 characters?
      if (!this.emailV) this.Vtext = 'Email is required.';
      else if (!this.passwordV) this.Vtext = 'Password must be at least 6 characters.';
      else this.Vtext = 'Invalid credentials.';

      if (!this.emailV || !this.passwordV) {
        this.triggerSnackbar({
          visible: true,
          text: this.Vtext,
          color: 'red',
          timeout: 6000,
          icon: 'mdi-alert-circle',
          offset: 'left',
        });
        return;
      }
      try {
        // TODO: edit this to check for valid SWSID
        if (await auth.login(this.credentials)){

      //     window.storage.getItem('SWSID').then((value) => {
      //   this.session = toRaw(JSON.parse(value));
      // });
      // if (this.session != null) 
        // await window.storage.removeItem('SWSID');
          // set SWSID to localstorage
        await window.storage.setItem('SWSID', JSON.stringify(auth.session));
          // get SWSID from localstorage
          // await window.storage.getItem('SWSID').then((value) => {
            // this.session = toRaw(JSON.parse(value));
          // });
          //redirect to profile
          window.location.href = '/profile';


        }
        else
        return;
      } catch (error) {
        this.triggerSnackbar({
          visible: true,
          text: 'Invalid credentials.',
          color: 'red',
          timeout: 6000,
          icon: 'mdi-alert-circle',
          offset: 'left',
        });
        console.log(error);
        console.log('Invalid credentials. Login.vue');
      }

      this.doInterval = false;

      // go to profile, but refresh header component
    },
    setUserImg(email) {
      fetch(`/api/avatar/head/${email}`)
        .then((response) => response.json())
        .then((data) => {
          this.img = '';
          this.img = data.url;
        });
    },
    setRandom() {
      //if element does not have class pause
      // if (!document.getElementsByClassName('').className.includes('pause')) {
      if (this.doInterval) {
        fetch('/api/avatar/head')
          .then((response) => response.json())
          .then((data) => {
            this.img = '';
            this.img = data.url;
          });
      } else if (this.emailV) {
        clearInterval();
      } else this.doInterval = true;
      // }

      // set img to resp data
    },

    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }, 
    async auth(event) {
      if(event.origin !== import.meta.env.VITE_DEFAULT_URL) return;
      this.credentials.email = event.data.data.username;
      this.credentials.password = event.data.data.password;
      if (this.credentials.email === null || this.credentials.password === null) return;
      // TODO: edit this to check for valid SWSID
      if (await auth.login(this.credentials)){
          localStorage.setItem('remember', JSON.stringify({value: true}));
          this.$router.push('/profile');
        }
    },
  },

  unmounted() {
    // stop setRandom from running
    this.doInterval = false;
    clearInterval();
  },

  async mounted() {
    //call parent function triggerSnackbar

    this.setRandom();
    setInterval(() => {
      this.setRandom();
    }, 10000);
    // try {
    //   // check if user is logged in
    //   // if logged in, redirect to profile
    //   // if not logged in, stay on login page
    //   this.checkSession();
    // } catch (error) {
    //   console.log(error);
    // }
    // this.checkSession();
    // window.app.login();
    // window.addEventListener('message', this.auth, false);

  },

  computed: {
    authUser() {
      return auth.authUser;
    },
  },

  watch: {
    'credentials.email': function (val) {
      //is email valid?
      //has @ and .com
      if (
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/.test(
          val
        )
      ) {
        this.doInterval = false;
        this.emailV = true;
        this.setUserImg(val);
      } else {
        this.emailV = false;
      }
    },
    'credentials.password': function (val) {
      if (val.length >= 6) {
        this.doInterval = false;
        this.passwordV = true;
      } else {
        this.passwordV = false;
      }
    },
    'credentials.remember': function (val) {
      if (val) {
        this.remember = true;
      } else {
        this.remember = false;
      }
    },
  },
  emits: ['triggerSnackbar'],
};
</script>
