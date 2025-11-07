<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card class="sw-dialog">
      <v-card-title class="sw-dialog-header">
        Sell Items
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
      <v-card-text class="sw-dialog-content">
        <v-list>
          <v-list-item v-for="(item, index) in itemsWithQuantity" :key="item.baseItemId">
            <template v-slot:prepend>
              <div class="item-icon-container">
                <img class="item-icon" :src="item.model_icon" :alt="item.model_details"/>
              </div>
            </template>
            <v-list-item-title>{{ item.model_desc }}</v-list-item-title>
            <v-list-item-subtitle>
              <div class="d-flex align-center justify-space-between">
                <span>Refund: <CommaValue :value="getItemRefundValue(item)"/></span>
                <div class="quantity-selector">
                  <v-btn 
                    density="compact" 
                    icon 
                    size="small"
                    variant="text"
                    :disabled="item.selectedCount <= 1"
                    @click="decrementQuantity(index)"
                  >
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                  <span class="quantity-display">{{ item.selectedCount }} / {{ item.count }}</span>
                  <v-btn 
                    density="compact" 
                    icon 
                    size="small"
                    variant="text"
                    :disabled="item.selectedCount >= item.count"
                    @click="incrementQuantity(index)"
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
        <div class="total-refund">
          Total Refund Amount: <CommaValue :value="totalRefundAmount"/>
        </div>
      </v-card-text>
      <v-card-actions class="sw-dialog-actions">
        <v-spacer></v-spacer>
        <v-btn class="blue darken-1" color="white" @click="close">Cancel</v-btn>
        <v-btn class="blue darken-1 swBtn" color="white" @click="refundItems">Refund</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import CommaValue from '@/components/utils/commaValue.vue';
export default {
  name: 'SellItems',
  props: {
    visible: {
      type: Boolean,
      required: true,
      default: false,
    },
    items: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  components: {
    CommaValue,
  },
  data() {
    return {
      itemsWithQuantity: []
    };
  },
  watch: {
    items: {
      immediate: true,
      handler(newItems) {
        this.initItemQuantities(newItems);
      }
    }
  },
  computed: {
    totalRefundAmount() {
      return this.itemsWithQuantity.reduce((total, item) => {
        return total + this.getItemRefundValue(item);
      }, 0);
    },
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
  },
  methods: {
    initItemQuantities(items) {
      this.itemsWithQuantity = items.map(item => ({
        ...item,
        selectedCount: item.count || 1
      }));
    },
    incrementQuantity(index) {
      const item = this.itemsWithQuantity[index];
      if (item.selectedCount < item.count) {
        item.selectedCount++;
      }
    },
    decrementQuantity(index) {
      const item = this.itemsWithQuantity[index];
      if (item.selectedCount > 1) {
        item.selectedCount--;
      }
    },
    getItemRefundValue(item) {
      // Refund is half of the item's price, multiplied by the selected quantity
      return (item.model_price_gold / 2) * item.selectedCount;
    },
    close() {
      this.$emit('close');
    },
    refundItems() {
      // Process items with their selected quantities
      const itemsToRefund = this.itemsWithQuantity.map(item => ({
        ...item,
        quantitySold: item.selectedCount
      }));
      
      console.log('Refunding items:', itemsToRefund);
      this.$emit('refund', itemsToRefund);
      this.close();
    },
  },
};
</script>

<style scoped>
.total-refund {
  font-weight: bold;
  margin-top: 16px;
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
  border-radius: 10px;
  margin: 5px;
  box-shadow: 0px .5px 2.5px 0px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
}

.item-icon-container {
  width: 48px;
  height: 48px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-icon {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.quantity-selector {
  display: flex;
  align-items: center;
  margin-top: 4px;
  margin-left: 8px;
}

.quantity-display {
  margin: 0 8px;
  min-width: 48px;
  text-align: center;
}
</style>