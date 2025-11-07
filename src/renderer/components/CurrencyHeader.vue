<script setup>
import { ref, onMounted, watch } from 'vue';
import { useUserStore } from '@stores/user.js';
import { WebSocketService } from '@/services/websocket';

const user = useUserStore();
const userState = ref(null);

onMounted(async () => {
  const uState = await window.storage.getItem('USER_INFO');
  userState.value = JSON.parse(uState);

  //
});

// Watch WebSocket messages
watch(WebSocketService.message, (newVal) => {
  if (newVal.action === 'userBalanceUpdate') {
    user.goldBalance = newVal.goldBalance;
    user.tokensBalance = newVal.tokensBalance;
    if (userState.value) {
      userState.value.goldBalance = newVal.goldBalance;
      userState.value.tokensBalance = newVal.tokensBalance;
      window.storage.removeItem('USER_INFO');
      window.storage.setItem('USER_INFO', JSON.stringify(userState.value));
    }
  }
});
</script>


<template>
  <v-container  height="100" fluid class="d-flex  justify-center align-center">
    <!-- <v-img :src="background" position="top" cover> -->
    <br />
    <v-row>
      <!-- </v-col> -->
      <v-col cols="8" >
        <!-- add swxlogo.png -->
        <v-img  src="swx-logo.png" height="100" width="265" ></v-img>
      </v-col>
      <!-- wrap in circular pill -->
      <!-- move to the right side -->
      <v-col cols="4" class="d-flex  align-center justify-center">
        <v-chip color="cyan" class="font-weight-bold mr-2" variant="elevated">
          <v-img src="icon_primary.png" height="20" width="20" class="mr-1"></v-img>
          {{ user.defaultAvatar.avatarXPs.primary.level }}
        </v-chip>
        <v-chip color="yellow" class="font-weight-bold mr-2" variant="elevated">
          <v-img src="balance_gold.png" height="20" width="20"></v-img>
          {{ numberWithCommas(user.goldBalance) }}
        </v-chip>
        <v-chip color="orange" class="font-weight-bold " variant="elevated">
          <v-img src="balance_token.png" height="20" width="20"></v-img>
          {{ numberWithCommas(user.tokensBalance) }}
        </v-chip>
        <!-- <v-img v-if="hasVIP" src="vip_on.png" height="30" width="88"></v-img> -->
      </v-col>
        </v-row>
  </v-container>
  <!-- </v-row> -->

  <!-- </v-col> -->
  <!-- <v-card> -->
</template>

<script>
import { useUserStore } from '@stores/user.js';
export default {
  name: 'CurrencyHeader',
  data() {
    return {
      user: useUserStore(),
      background: 'tc_bg.png',
      vip: false,
    };
  },
  methods: {
    //add commas to numbers
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    // if month is december, set background to holidayBG.png
    backgroundChange() {
      let date = new Date();
      let month = date.getMonth();
      if (month == 11) {
        this.background = 'holidayBG.png';
      }
    },
    hasVIP() {
      for (let i = 0; i < this.user.permissions.length; i++) {
        if (this.user.permissions[i].value == 90) {
          return true;
        }
      }
      return false;
    },

  },
  mounted() {
    this.backgroundChange();
    this.vip = this.hasVIP();
  },

};
</script>
