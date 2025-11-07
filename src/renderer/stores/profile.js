import { defineStore } from 'pinia';
import { ref } from 'vue';

// Define the profile store

// store the number of online users var in the store
export const useProfileStore = defineStore({
  id: 'profile',
  options: {
    // If you want to disable the auto-injection of this store in a component
    // This is useful if you want to use this store inside another store
    // without injecting it by default in a component
    // inject: []
  },
  state: () => ({
    onlineUsers: ref(0),
  }),
  actions: {
    // update the number of online users
    updateOnlineUsers(data) {
      this.onlineUsers = data;
    },
  },

});