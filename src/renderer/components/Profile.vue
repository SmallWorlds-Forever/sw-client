<template>
  <v-container fluid>
    <v-row>
      <v-col cols="4">
      <!-- <v-card
        dark
        class="pa-4"
        height="100%"
      > -->
        <aviLayout :user="user" @triggerSnackbar="triggerSnackbar"
        />
    <!-- </v-card> -->
  </v-col>

      <v-col cols="6">  
        <spacesLayout :spaces="spaces" 
        :rightActive="rightActive"
        :leftActive="leftActive"
        :mySpacesActive="mySpacesActive"
        :favsActive="favsActive"
        :featuredActive="featuredActive"
        :popularActive="popularActive"
        :msg="msg"
        @changeTab="changeTab"
        @nextSpace="nextSpace"
        @prevSpace="prevSpace"
        @navigateToSpace="navigateToSpace"
        />
      </v-col>
      <v-col cols="2">
       <widgetLayout :user="user" @triggerDialog="triggerDialog" />
      </v-col>
    </v-row>
    <snackBar :snackbar.sync="snackbar" />
    <vdialog
      :visible="showDialog"
      :content="panel"
      @close="showDialog = false"
    />
  </v-container>
</template>
<script>
import { useUserStore } from '@stores/user.js';
import { useAuthStore } from '@stores/auth.js';
import { useProfileStore } from '@stores/profile.js';
import { useGameStore } from '@stores/game.js';
import snackBar from '@components/utils/snackBar.vue';
import vdialog from '@components/utils/dialogFlash.vue';
import aviLayout from '@components/profile/aviLayout.vue';
import spacesLayout from '@components/profile/spacesLayout.vue';
import widgetLayout from '@components/profile/widgetLayout.vue';
import { WebSocketService } from '@/services/websocket';
import { useMeta } from 'vue-meta';
import deleteAllCookies from 'delete-all-cookies';

export default {
  name: 'ProfileComponent',
  components: {
    snackBar,
    vdialog,
    aviLayout,
    spacesLayout,
    widgetLayout,
  },
  setup () {
    useMeta({ title: 'Profile' });
    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
  },

  data() {
    return {
      user: useUserStore(),
      auth: useAuthStore(),
      game: useGameStore(),
      spaces: [],
      tab: 'mySpaces',
      onlineAvi: null,
      mySpaces: [],
      favs: [],
      featured: [],
      popular: [],
      mySpacesActive: true,
      favsActive: false,
      featuredActive: false,
      popularActive: false,
      initialSpaceLoad: true,
      rightActive: true,
      leftActive: true,
      nextArr: [],
      prevArr: [],
      spaceArr: [],
      msg: '',

      snackbar: {
        visible: false,
        text: '',
        color: '',
        icon: '',
        timeout: 0,
        variant: 'tonal',
      },
      showDialog: false,
      panel: {
        url: '',
        width: 0,
        height: 0,
      },
      currentPage: 0,
    };
  },
  methods: {
    
    triggerDialog(data) {
      this.showDialog = true;
      this.panel.panelName = data.name;
      this.panel.width = data.width;
      this.panel.height = data.height;
      if (data.name === 'spinToWinPanelSwf')
      {
        this.panel.flash = this.game.webassetsPath + 'homepage/home_panel_spin.swf';
        this.panel.flashvars = 'avatarImagesPath=' + this.game.avatarImagesPath +'&webServiceUrl=' + this.game.webServiceUrl + '&contentUrl=' + this.game.contentUrl;
      }
      else if (data.name === 'PetPanelSwf')
      {
        this.panel.flash = this.game.webassetsPath + 'homepage/home_panel_pet.swf';
        this.panel.flashvars = 'avatarImagesPath=' + this.game.avatarImagesPath +'&wwwRoot='+ this.game.wwwRoot+'&avatarId='+ this.user.defaultAvatar.id +'&wid=1&ownerId='+this.user.defaultAvatar.id +'&webServiceUrl=' + this.game.webServiceUrl + '&contentUrl=' + this.game.contentUrl;
      }
      else if (data.name === 'PlantPanelSwf')
      {
        this.panel.flash = this.game.webassetsPath + 'homepage/home_panel_plant.swf';
        this.panel.flashvars = 'config=' + this.game.config +'&avatarId='+ this.user.defaultAvatar.id;
      }

    },
    triggerSnackbar(data) {
      const defaultData = {
        visible: true,
        text: '',
        color: '',
        icon: '',
        timeout: 2000,
        variant: 'tonal',
        offset: 0,
      };

      this.snackbar = { ...defaultData, ...data };
      setTimeout(() => {
        this.snackbar.visible = false;
      }, this.snackbar.timeout);
    },
    updateDuration(data) {
      this.durationData = data;
    },

  
    navigateToSpace(spaceId) {
      window.location.href = `
      ${window.location.origin}/space/${spaceId}`;
      // this.$router.push({ name: 'space', params: { id: spaceId } });
    },

    changeTab(tab) {
      this.msg = '';
      if (this.tab !== tab && tab != 'pop') this.getSpaces(tab);
      if (tab === 'pop') this.getPop(tab);
      this.tab = tab;
      // remove v-btn--active from all buttons
      if (tab === 'mySpaces') {
        this.mySpacesActive = true;
        this.favsActive = false;
        this.featuredActive = false;
        this.popularActive = false;
      } else if (tab === 'favs') {
        this.mySpacesActive = false;
        this.favsActive = true;
        this.featuredActive = false;
        this.popularActive = false;
      } else if (tab === 'featured') {
        this.mySpacesActive = false;
        this.favsActive = false;
        this.featuredActive = true;
        this.popularActive = false;
      } else if (tab === 'pop') {
        this.mySpacesActive = false;
        this.favsActive = false;
        this.featuredActive = false;
        this.popularActive = true;
      }
    },

    nextSpace() {
      if (this.currentPage + 1 < this.spaceArr.length) {
        this.prevArr = this.spaces;
        this.spaces = this.nextArr;
        this.currentPage++;
        this.nextArr = this.spaceArr[this.currentPage + 1];
        this.leftActive = false;
        this.rightActive = this.currentPage + 1 >= this.spaceArr.length;
      }
    },
    prevSpace() {
      if (this.currentPage > 0) {
        this.nextArr = this.spaces;
        this.spaces = this.prevArr;
        this.currentPage--;
        this.prevArr = this.spaceArr[this.currentPage - 1];
        this.rightActive = false;
        this.leftActive = this.currentPage <= 0;
      }
    },
    async getPop(tab)
    {
      // check if anyone is online from the profile store
      if (useProfileStore().onlineUsers < 1) {
        // show offline message
        this.msg = 'No one is online :(';
        this.spaces = [];
        this.spaceArr = [];
      }
      else 
      {
        const res = await fetch('/api/spaces/popular', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Authorization: 'Bearer ' + this.auth.$state.token,
            SWSID: this.auth.$state.session.SWSID,
          },
        });
        const data = await res.json();
        // if data is empty array
        if (data.popular.length < 1) {
          this.msg = 'No one is online :(';
          this.spaces = [];
          this.spaceArr = [];
          // set store to 0 and update OnlineHeader.numOnline
          useProfileStore().onlineUsers = 0;
          
          return;
        }
        this.popular = data.popular;
        
        if (tab === 'pop') {
          this.spaces = [];
          this.spaceArr = [];
          this.spaces = this.popular;
          this.spaceArr = this.popular;
          if (this.spaces.length > 1) {
            this.rightActive = false;
            this.nextArr = this.spaces[1];
          } else {
            this.nextArr = [];
            this.rightActive = true;
          }
          this.leftActive = true;
          this.spaces = this.spaces[0];
          this.prevArr = this.spaces[0];
        }
    }
    },
    async getSpaces(tab) {
      if (this.initialSpaceLoad) {
        this.initialSpaceLoad = false;
        const res = await fetch('/api/spaces/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Authorization: 'Bearer ' + this.auth.$state.token,
            SWSID: this.auth.$state.session.SWSID,
          },
        });
        const data = await res.json();
        // check for 401 
        if (data.message === 'Unauthorized') {
          // logout
          this.auth.logout();
        }
        this.mySpaces = data.mySpaces;
        this.spaces = this.mySpaces;
        this.myFavs = data.myFavs;
        this.featured = data.featured;

        // return;
      }
      if (tab === 'mySpaces') {
        this.spaces = [];
        this.spaceArr = [];
        this.spaces = this.mySpaces;
        this.spaceArr = this.mySpaces;

        // set pages
        // spaces is a 2d array
        if (this.spaces.length > 1) {
          this.rightActive = false;
          this.nextArr = this.spaces[1];
        } else {
          this.nextArr = [];
          this.rightActive = true;
        }
        this.leftActive = true;
        // set array at index 0
        this.spaces = this.spaces[0];
        this.prevArr = this.spaces[0];
      } else if (tab === 'favs') {
        this.spaces = [];
        this.spaceArr = [];
        this.spaces = this.myFavs;
        this.spaceArr = this.myFavs;

        if (this.spaces.length > 1) {
          this.rightActive = false;
          this.nextArr = this.spaces[1];
        } else {
          this.nextArr = [];
          this.rightActive = true;
        }
        // set array at index 0
        this.leftActive = true;
        if (this.spaces.length < 1) {
          this.msg = 'No favorites added yet!';
          this.spaces = [];
          this.spaceArr = [];
          return;
        }
        this.spaces = this.spaces[0];
        this.prevArr = this.spaces[0];
      } else if (tab === 'featured') {
        // get featured
        this.spaces = [];
        this.spaceArr = [];
        this.spaces = this.featured;
        this.spaceArr = this.featured;
        if (this.spaces.length > 1) {
          this.rightActive = false;
          this.nextArr = this.spaces[1];
        } else {
          this.nextArr = [];
          this.rightActive = true;
        }
        // set array at index 0
        this.currentPage = 0;
        this.leftActive = true;
        this.spaces = this.spaces[0];
        this.prevArr = this.spaces[0];
      }
    },
  },

  mounted() {
    // removes all cookies; this clogs the websocket and cookies are only needed when logging in or registering
    // use npm i delete-all-cookies
    deleteAllCookies();

    // set rpc
    this.getSpaces(this.tab);
    window.rpc.setRPC({
      details: 'Profile',
      state: this.user.defaultAvatar.firstName + ' ' + this.user.defaultAvatar.lastName,
      largeImageKey: 'logo',
      largeImageText: 'SWX',
      party: {
        id: this.auth.session.swsid,
        // set size to 1 of how many avatars the user owns
        size: [1, this.user.activeAvatars.length],
      },
      startTimestamp: Date.now(),
    });
},
};
</script>

<style scoped>


/* Add transition effects for smooth rendering */
.v-row {
  transition: all 0.3s ease;
}

.v-col {
  transition: all 0.2s ease;
}
</style>
