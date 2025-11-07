<template>
  <!-- iframe router source-->
  <object class="gameFrame" height="100%" width="100%" style="position: absolute;bottom: 0px; width: 100%;" type="application/x-shockwave-flash" :data=preloader id="Main" name="Main">
    <param name="menu" value="false">
    <param name="quality" value="high">
    <!-- <param name="movie" :value="preloader"> -->
    <param name="bgcolor" value="#e1e1e1">
    <param name="flashvars" :value="flashvars">
    <param name="allowScriptAccess" value="always">
    <param name="allowFullScreen" value="true">
    <param name="wmode" value="window">
  </object>
  
</template>

<script>
import { defineComponent, watch } from 'vue';
import router from '@/router';
import axios from 'axios';
import { useAuthStore} from '@/stores/auth.js';
const auth = useAuthStore();
import { useMeta, useActiveMeta } from 'vue-meta';

export default defineComponent({
  name: 'SpaceView',
  setup () {
    const metaManager = useMeta({ title: 'Loading Space...',
      description: 'SWX'
     });
    // get the currently used metainfo
    const metadata = useActiveMeta();

    watch(metadata, (newValue) => {
      // metadata was updated, update the title
      useMeta({ title: newValue,
        description: 'SWX'
      });
    })
    return {
      metaManager,
    };
  },
  data() {
    return {
      preloader: null,
      flashvars: null,
      url: router.currentRoute.value.path,
      spaceId: router.currentRoute.value.params.id,
      spaceName: null,
      spaceDesc: null,
      home: false,
      type: null,
      count: 0,
      metaManager: null,
    };
  },
  methods: {
    //update header url when onload is called
    frameChange() {
      this.$emit(
        'updateHeader', //get url from iframe
        this.url
      );
    },

    async getSpaceData(spaceId) {
     try {
        const response = await axios.get('/api/space/config/' + spaceId, {
          headers: {
            'SWSID': auth.session.SWSID,
          }
        });
        const data = response.data;
        this.preloader = data.preloader;
        this.flashvars = data.flashvars;
        // Handle the response data
      } catch (error) {
        console.error('Error fetching space data:', error);
      }
    },

    async getSpaceName(spaceId) {
      //does url have home in it or space? if has home then set home to true
      if (this.url.includes('home')) {
        this.home = true;
        this.type = 'home';
      }
      this.type = 'space';

      const response = await fetch(
        '/api/space/name/' + this.type + '/' + spaceId
      );
      const data = await response.json();
      //if (data !== null){
      this.spaceName = data.name;
      this.spaceDesc = data.desc.toString();
      this.spaceId = router.currentRoute.value.params.id;
      // update meta title

      this.metaManager.title = this.spaceName + ' | SWX'.toString();
      this.metaManager.description = this.spaceDesc;


      await window.rpc.setRPC({
        details: 'At ' + data.name,
        state: data.desc.toString(),
        largeImageKey: 'logo',
        largeImageText: 'SWX',
        startTimestamp: Date.now(),
        // show buttons go there
        buttons: [
          {
            label: 'Go there',
            // app link
            url: 'swx://' + this.spaceId,
          },
        ],
      });
  },
},
  async mounted() {

    // TODO in future: emit an event to electron to update other users profile onlineUsers
    
    // set page http header to iframe url
    // const iFrame = this.$refs.frame;
    // iFrame.addEventListener('load', () => {

    //   // get url of iframe
    //   this.url = iFrame.contentWindow.location.href;

    //   this.url = this.url.replace(import.meta.env.VITE_DEFAULT_URL, '');

    //   //update the current url to the frame address
    //   this.frameChange();
    //   this.count++;

    //   router.push(this.url);
    //   if (this.count >= 0) {
    //     this.getSpaceName(this.spaceId);
    //   }

    // });

    this.spaceId  = router.currentRoute.value.params.id;
    await this.getSpaceName(this.spaceId);
    await this.getSpaceData(this.spaceId);
  },

  //listen for when iframe url changes
  watch: {
    url() {
      this.frameChange();
    },
  },
});
</script>
