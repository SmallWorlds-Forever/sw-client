<template>
  <v-dialog v-model="dialog" max-width="800" width="800">
    <v-card class="sw-dialog">
      <v-card-title class="sw-dialog-header">
        Inventory
        <v-btn
          icon
          color="white darken-1"
          class="swCloseBtn"
          @click="close"
          variant="tonal"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      
      <!-- Search bar -->
      <v-card-subtitle class="pa-2">
        <v-text-field
          v-model="searchQuery"
          clearable
          hide-details
          density="compact"
          variant="outlined"
          placeholder="Search items..."
          prepend-inner-icon="mdi-magnify"
          @click:clear="searchQuery = ''"
        ></v-text-field>
      </v-card-subtitle>
      
      <v-card-text class="sw-dialog-content">
          <div v-if="items.length > 0" class="inventory-grid">
            <div
              v-for="item in filteredItems"
              :key="item.baseItemId"
              class="inventory-item"
              :class="{ selected: isItemSelected(item.baseItemId) }"
              @click="selectItem(item.baseItemId)"
            >
              <img :src="item.model_icon" :alt="item.model_details" />
              <v-tooltip activator="parent" location="bottom">
                {{ item.model_desc }}
              </v-tooltip>
              <div v-if="item.count > 1" class="item-count">
                {{ item.count }}
              </div>
            </div>
          </div>
        <div v-else class="inventory-grid">
            <!-- Show 20 skeleton loaders that look like items -->
            <div
              v-for="index in 60"
              :key="index"
              class="inventory-item"
                style="background: radial-gradient(circle, rgba(255, 255, 255, 0.7) 5%, rgba(255, 255, 255, 0) 70%);"
            >
                <v-skeleton-loader
                    class="mx-auto"
                    :loading="true"
                    :height="40"
                    :width="40"
                >
                    <template v-slot:default>
                    <img src="" alt="" />
                    </template>
                </v-skeleton-loader>
                </div>
        </div>
      </v-card-text>
      <v-card-actions v-if="selectedItems.length > 0" class="sw-dialog-actions float">
        <!-- Selected Items: {{ selectedItemNames }} -->
         <!-- Count selected items -->
          {{ selectedItemsC }} {{ selectedItemsC === 1 ? 'item' : 'items' }} selected
        <!-- Add two butns Gift & Sell -->
        <v-spacer></v-spacer>
        <v-btn class="blue darken-1 swBtn" variant="text" @click="close">
          Gift
        </v-btn>
        <v-btn class="blue darken-1 swBtn" color="white" @click="openSellItems">
          Sell
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <sellItems
  :visible="sellItemsDialog"
  :items="selectedItemsList"
  @close="sellItemsDialog = false"
  />
</template>

<script>
import { useAuthStore } from '@/stores/auth.js';
import { useGameStore } from '@/stores/game.js';
import sellItems from './sellItems.vue';
export default {
  name: "userInventory",
  props: {
    iDialog: { // Change from visible to dialog to match parent
      type: Boolean,
      required: true,
      default: false,
    },
  },
  emits: ['update:dialog', 'close'], // Declare emitted events
  components: {
    sellItems,
  },
  data() 
  {
    return {
      items: [],
      selectedItems: [], // Changed to an array
      sellItemsDialog: false,
      searchQuery: '', // Added search query
    };
  },
  computed: 
  {
    uniqueItems() {
      const unique = {};
      this.items.forEach(item => {
        if (!unique[item.baseItemId]) {
          unique[item.baseItemId] = { ...item, count: 1 };
        } else {
          unique[item.baseItemId].count++;
        }
      });
      return Object.values(unique);
    },
    filteredItems() {
      if (!this.searchQuery) {
        return this.uniqueItems;
      }
      
      const query = this.searchQuery.toLowerCase();
      return this.uniqueItems.filter(item => 
        (item.model_desc && item.model_desc.toLowerCase().includes(query)) || 
        (item.model_details && item.model_details.toLowerCase().includes(query))
      );
    },
    selectedItemNames() {
      return this.uniqueItems
        .filter(item => this.selectedItems.includes(item.baseItemId))
        .map(item => item.model_desc)
        .join(', ');
    },
    selectedItemsC() {
        // add the count of selected items and add the count if item.count > 1
        return this.selectedItemsList.reduce((acc, item) => acc + item.count, 0);
    },
    selectedItemsList() {
      return this.uniqueItems.filter(item => this.selectedItems.includes(item.baseItemId));
    },
    dialog: {
      get() {
        return this.iDialog;
      },
      set(value) {
        if (!value) {
          this.$emit('close');
        }
      },
  },
  },
  async mounted() {
    // Fetch items from API
    try {
      const response = await fetch("/api/inventory", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // add swsid to headers
          "swsid": useAuthStore().session.SWSID,
        },
      });

      if (response.ok) {
        this.items = await response.json();
        // prepend game Store . contentUrl to item.model_icon
        this.items.forEach(item => {
          item.model_icon =
            useGameStore().contentUrl + "assets/" + item.model_icon;
        });
        // sort the items by model_tags
        this.items.sort((a, b) => a.model_tags.localeCompare(b.model_tags));
      } else {
        console.error("Failed to fetch inventory:", response.status);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  },
  methods: {
    close() {
      this.$emit("close");
      this.$emit('update:dialog', false);
    },
    selectItem(baseItemId) {
      const index = this.selectedItems.indexOf(baseItemId);
      if (index > -1) {
        // If the item is already selected, deselect it
        this.selectedItems.splice(index, 1);
      } else {
        // Otherwise, select the item
        this.selectedItems.push(baseItemId);
      }
    },
    isItemSelected(baseItemId) {
      return this.selectedItems.indexOf(baseItemId) > -1;
    },
    openSellItems() {
      this.sellItemsDialog = true;
    },
 
  },
};
</script>

<style scoped>
.sw-dialog {
  position: relative;
  width: 100%;
}



.inventory-item {
  width: calc(100% / 10); /* Adjust as needed */
  padding: 8px;
  text-align: center;
  box-sizing: border-box;
  position: relative;
  cursor: pointer;
}

.inventory-item img {
  max-width: 100%;
  height: auto;
}

.inventory-item.selected {
  /* glass effect */
  border-radius: 8px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.7) 5%, rgba(255, 255, 255, 0) 70%);
}

.item-count {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 0.7em;
  padding: 2px 4px;
  border-radius: 4px;
}

.sw-dialog-content {
  overflow-y: auto; /* Enable vertical scrolling */
  max-height: 600px; /* Set a maximum height for the scrolling content */
  scrollbar-width: thin;
}

.sw-dialog-actions.float {
  position: -webkit-sticky; /* for Safari */
  position: sticky;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgb(20, 149, 179);
  color: white; /* Optional: set text color to ensure readability */
  padding: 8px;
  box-sizing: border-box;
}

/* Style for the search field */
.v-card-subtitle {
  padding-top: 0;
  padding-bottom: 8px;
}

.v-text-field {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}
</style>
