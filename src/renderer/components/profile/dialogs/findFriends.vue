<!-- Friends Details Dialog Component
 This components shows the users friends details like username, avatar, and other details.
 It will show buttons to remove the friend or send a message and show online status. -->
<template>
    <v-dialog
      v-model="dialog"
      max-width="500"
      :persistent="isSaving"
    >
    <!-- This components shows a list of the users friends details like username, avatar, and other details.
 It will show buttons to remove the friend or send a message and show online status. For now use dummy data-->
    <v-card class="sw-dialog">
      <v-card-title class="sw-dialog-header">
        Friends List
        <v-btn icon color="white darken-1" class="swCloseBtn" @click="close" variant="tonal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      
      <div class="px-4 pb-2 pt-1 d-flex align-center">
        <v-text-field
          v-model="searchQuery"
          label="Search Friends"
          outlined
          dense
          prepend-inner-icon="mdi-magnify"
          clearable
          @click:clear="clearSearch"
        ></v-text-field>
      </div>
     
      <v-list dense two-line class="pa-2 sw-grid">
        <template v-if="filteredFriends.length > 0">
          <template v-for="friend in filteredFriends" :key="friend.id">
            <v-list-item class="friend-row">
              <template v-slot:prepend>
                <v-avatar size="50" class="my-2 mr-3">
                  <v-img :src="friend.thumbUrl" alt="Friend Avatar"></v-img>
                </v-avatar>
              </template>
              
              <v-list-item-title class="font-weight-medium">{{ friend.firstName }} {{ friend.lastName }}</v-list-item-title>
              <v-list-item-subtitle>{{ friend.online }}</v-list-item-subtitle>
              
              <template v-slot:append>
                <v-btn icon="mdi-message" size="small" @click="sendMessage(friend)" class="mr-1"></v-btn>
                <v-btn icon="mdi-account-remove" size="small" @click="removeFriend(friend.id)"></v-btn>
              </template>
            </v-list-item>
          </template>
        </template>
        <template v-else>
          <v-list-item>
            <v-list-item-content>
              <div class="text-center pa-4">
                <v-icon large class="mb-2">mdi-account-search</v-icon>
                <div>No friends found matching "{{ searchQuery }}"</div>
                <v-btn
                  text
                  color="primary"
                  class="mt-2"
                  @click="clearSearch"
                >
                  Clear Search
                </v-btn>
              </div>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>

      <v-progress-circular
        v-if="isSaving"
        indeterminate
        color="primary"
        class="ma-4"
      ></v-progress-circular>
    </v-card>
  </v-dialog>
  <v-dialog v-model="showRemoveDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Remove Friend</v-card-title>
        <v-card-text>
          Are you sure you want to remove <strong>{{ friendToRemove?.name }}</strong> from your friends list?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showRemoveDialog = false">Cancel</v-btn>
          <v-btn color="error" text @click="confirmRemoveFriend">Remove</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
<script>
export default {
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
    friends: {
      type: Array,
      default: () => [],
      required: true,
    }
  },
  
  data() {
    return {
      searchQuery: '',
      isSaving: false,
    };
  },
  emits: ['close'],
  computed: {
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
    filteredFriends() {
      if (!this.searchQuery) {
        return this.friends;
      }
      
      const query = this.searchQuery.toLowerCase();
      return this.friends.filter(friend => 
        friend.username.toLowerCase().includes(query)
      );
    }
  },

  methods: {
    clearSearch() {
      this.searchQuery = '';
    },
    close() {
      this.$emit('close');
    },
    sendMessage(friend) {
      // Implement message sending logic
      console.log('Send message to:', friend.username);
    },
    removeFriend(friendId) {
      // Implement friend removal logic
      console.log('Remove friend with ID:', friendId);
      this.isSaving = true;
      // Simulate API call
      setTimeout(() => {
        this.friends = this.friends.filter(friend => friend.id !== friendId);
        this.isSaving = false;
      }, 1000);
    },
    findFriends() {
      this.isSaving = true;
      // Simulate an API call
      setTimeout(() => {
        this.isSaving = false;
        this.close();
      }, 2000);
    },
    fetchFriends(){
      // Friends is in the userStore under defaultAvatar > friends
      const friends = this.$store.state.user.defaultAvatar.friends;
      if(friends && friends.length > 0){
        this.friends = friends;
      }
      else {
        this.friends = [];
      }

      // For now, we use static data
    }
  },
  
};
</script>
<style scoped>
.friend-row {
  display: flex;
  align-items: center;
  width: 90%; /* Ensure each row takes full width */
  padding: 6px 6px; /* Add some horizontal padding for breathing room */
}

.sw-grid {
  width: 100%; /* Ensure the list takes full dialog width */
}

/* Make the v-list-item take full width */
:deep(.v-list-item) {
  width: 100%;
  padding-left: 0;
  padding-right: 0;
}

/* Make the content area expand to fill available space */
:deep(.v-list-item__content) {
  flex: 1;
  width: 100%;
}

/* Ensure the titles are centered in the available space */
.v-list-item-title.text-center,
.v-list-item-subtitle.text-center {
  text-align: center;
  width: 100%;
}

/* Optional: Adjust avatar margins for better spacing */
:deep(.v-avatar) {
  margin-right: 12px;
}

/* Optional: Add subtle dividers between friends */
.friend-row:not(:last-child) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
.v-list {
  background: none;
  border-radius: 10px;
  scrollbar-width: thin;
  overflow-y: auto;
  max-height: 500px;
}
.v-list-item {
  padding: 10px; 
  margin-bottom: 5px;
  border-radius: 10px !important;
  box-shadow: 0px .5px 2.5px 0px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
}
.v-list-item:last-child {
  margin-bottom: 0;
}

</style>