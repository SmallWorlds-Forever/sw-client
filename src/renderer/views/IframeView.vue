<template>
  <!--&lt;!&ndash;  iframe router source-->
  <iframe
    ref="frame"
    :src="url"
    style="width: 100%; height: 100%; border: none"
  />
  <!-- show a webpage with axios auth bearer token -->
</template>

<script>
import { defineComponent } from 'vue';
import router from '@/router';
// import axios from 'axios';
export default defineComponent({
  name: 'IframeView',
  data() {
    return {
      url: import.meta.env.VITE_DEFAULT_URL + router.currentRoute.value.path,
      // find the number in the url after /space/ and set it to spaceId
      spaceId: null,
      spaceName: null,
      spaceDesc: null,
      home: false,
      type: null,
      content: '',
      count: 0,
      iframeTitle: '',
    };
  },

  methods: {
    //
    // async setContents() {
    //   let token = JSON.parse(localStorage.getItem('AUTH_STATE')).token;
    //   axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    //   // get session cookie from base url
    //   const response = await axios.get(this.url);
    //   //set iframe to response.data

    //   //  this.content = this.$refs.frame.contentWindow.document;
    //   //  this.content.open('text/html', 'replace');
    //   //  this.content.write(response.data);
    //   //  this.content.close();
    // },
    //update header url when onload is called
    frameChange() {
      //what is the url of the frame?
      // this.url = document.querySelector('iframe').contentWindow.location.href;
      //pass url to header
      //update the current url to the frame address
      // this.url = router.currentRoute.value.path;
      this.$emit(
        'updateHeader', //get url from iframe
        this.url
      );
      console.log(this.url);
    },
  },
  async mounted() {
    // await this.setContents();
    const iFrame = this.$refs.frame;
    // console.log('in iframe' + this.url);
    iFrame.addEventListener('load', () => {
      // get url of iframe
      this.url = iFrame.contentWindow.location.href;
      this.url = this.url.replace(import.meta.env.VITE_DEFAULT_URL, '');
      this.iframeTitle = iFrame.contentWindow.document.title;
      //update the current url to the frame address
      this.frameChange();
      // this.count++;

      router.push(this.url);

    });
    //get url after /space/ or /home/ and set it to spaceId
    // this.spaceId = router.currentRoute.value.path.replace(/[^\/]+$/, '');
    // // this return /space/scarecrow/
    // // get rid of /space/ and set it to spaceId
    // this.spaceId = this.spaceId.replace('/space/', '');
    // console.log('spaceId: ' + this.spaceId);
    // await this.getSpaceName(this.spaceId);
  },
  //listen for when iframe url changes
  watch: {},
});
</script>
