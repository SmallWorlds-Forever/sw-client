<script setup>
import { useProfileStore } from '@stores/profile.js';
import { WebSocketService } from '@/services/websocket';
import { ref, onMounted, watch } from 'vue';
const profileStore = useProfileStore();
const online = ref(null);
const worldOnlineColor = ref('yellow');
// const flashG = ref('#46a239');
// const time = ref(new Date().toLocaleTimeString([], {
//   hour: '2-digit',
//   minute: '2-digit',
// }));

// On Mounted send a message to websocket to get online users if websocket fails server is offline
onMounted(async () => {
  WebSocketService.sendMessage({ action: 'getOnlineUsers'}, null);
  // setInterval(() => {
  //   time.value = new Date().toLocaleTimeString([], {
  //     hour: '2-digit',
  //     minute: '2-digit',
  //   });
  //   if (flashG.value === '#46a239') {
  //     flashG.value = '#54b347';
  //   } else {
  //     flashG.value = '#46a239';
  //   }
  // }, 1000);

  if (WebSocketService.isConnected.value) {
    online.value = true;
    worldOnlineColor.value = 'green';
  } else {
    online.value = false;
    worldOnlineColor.value = 'red';
  }
});

// watch if webSocket is online
watch(WebSocketService.isConnected, (newVal) => {
  console.log('WebSocketService.isConnected:', newVal);
  if (newVal) {
    online.value = true;
    worldOnlineColor.value = 'green';
  } else {
    online.value = false;
    worldOnlineColor.value = 'red';
  }
});

// watch WebSocket messages
watch(WebSocketService.message, (newVal) => {
  if (newVal.action === 'onlineUsers') {
    online.value = true;
    worldOnlineColor.value = 'green';
    profileStore.onlineUsers = newVal.onlineUsers;
    console.log('Online Users:', newVal.onlineUsers);
  }
  if (newVal.action === 'serverOffline') {
    online.value = false;
    worldOnlineColor.value = 'red';
  }
});


</script>
<template>
  <v-container height="60" class="oh-bg" fluid>
    <v-row>
      <v-col cols="3">
        <v-tooltip v-model="show_a" location="bottom">
          <template v-slot:activator="{ props }">
            <p class="d-flex justify" v-bind="props">Select Avatar</p>

          </template>
          <span ref="avi">Below, click on an avatar that you want to go in-world with!</span>
        </v-tooltip>
      </v-col>
      <v-col cols="6">
        <p class="d-flex justify" style="margin-left: 20%;">Select Space</p>
      </v-col>
      <!-- show a flashing green dot -->
      <v-col cols="3">
        <!-- <v-row> -->

        <!-- show the current time -->
        <v-chip color="blue" class="white--text float-right">
          <v-icon class="mr-1">mdi-clock</v-icon> {{ time }}
        </v-chip>
        <v-chip
          :color="worldOnlineColor"
          class="white--text float-right"
          v-if="online"
        >
          <v-icon :color="flashG" class="mr-1">mdi-circle</v-icon> {{ profileStore.onlineUsers }} Playing
          Now
        </v-chip>
        <v-chip
          :color="worldOnlineColor"
          class="white--text float-right"
          v-else-if="online != null && online == false"
        >
          Server Offline
        </v-chip>
        <v-chip
          :color="worldOnlineColor"
          class="white--text float-right"
          v-else
          >Loading...
        </v-chip>
        <!-- </v-row> -->
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { useProfileStore } from '@stores/profile.js';
import { useAuthStore } from '@stores/auth.js';
const auth = useAuthStore();

export default {
  name: 'OnlineHeader',
  data() {
    return {
      show_a: false,
      online: null,
      worldOnlineColor: 'yellow',
      // numOnline: -1,
      flashG: '#46a239',
      // exclude seconds
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  },

  methods: {
    async onlineAmount() {
      try {
        const resp = await fetch('/api/avatar/findtotalonline', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'SWSID': auth.session.SWSID,
          },
        });
        const data = await resp.json();
        useProfileStore().onlineUsers = data[0];
      } catch (error) {
        console.error('Error fetching online amount:', error);
      }
    },
    async worldOnline() {
      // 
      try {
        const resp = await fetch('/api/world/online', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'SWSID': auth.session.SWSID,
          },
        });
        const data = await resp.json();
        if (data.online == true && this.online == null) {
          this.online = true;
          this.worldOnlineColor = 'green'; 
        } 
        if (!this.online && data.online) {
          // refresh the page
          window.location.reload(); 
          console.log('Server is back online');
        }
      } catch (error) {
        this.online = false;
        this.worldOnlineColor = 'red';
        console.error('Error fetching world online status:', error);
      }
    },
  },

  mounted() {
    // this.onlineAmount();
    // this.worldOnline();
    setInterval(() => {
      this.time = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      if (this.flashG === '#46a239') {
        this.flashG = '#54b347';
      } else {
        this.flashG = '#46a239';
      }
    }, 1000);
    // setInterval(() => {
    //   // this.onlineAmount();
    //   // this.worldOnline();
    // }, 300000);
  },
};
</script>
<style scoped >
.oh-bg {
  background-color: #0d242c78;
  
}

</style>
