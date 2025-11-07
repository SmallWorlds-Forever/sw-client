<template>
          <v-card class="pa-4 avi" height="100%" max-height="587">

   <v-card-title class="align-center justify-center d-flex mb-12"
          ></v-card-title>
        <v-img
          src="widget_spin.png"
          class="widgetImg"
          @click="
            triggerDialog({
              name:  'spinToWinPanelSwf',
              width: '780px',
              height: '650px',
            })
          "
        ></v-img>

        <p class="d-flex justify mt-4 mb-3">
          <v-icon color="red">mdi-alert-circle</v-icon>
          <span class="ml-2">Spin now!</span>
        </p>


        <v-img
          src="widget_pets.png"
          class="widgetImg"
          @click="
            triggerDialog({
              name: 'PetPanelSwf',
              width: '218px',
              height: '280px',
            })
          "
        ></v-img>
        <!-- add a space between -->
        <p class="d-flex justify mt-4 mb-3">
          <v-icon color="green">mdi-check-circle</v-icon><span class="ml-2">Your pet is well cared
          for!</span>
        </p>

        <v-img
          src="widget_plants.png"
          class="widgetImg"
          @click="
            triggerDialog({
              name: 'PlantPanelSwf',
              width: '218px',
              height: '280px',
            })
          "
        ></v-img>
        <p class="d-flex justify mt-4 mb-3">
          <v-icon color="green">mdi-check-circle</v-icon><span class="ml-2">Your plants are
          healthy.</span>
        </p>
        </v-card>
</template>
<script>
export default {
  name: 'widgetLayout',
  emits: ['triggerDialog'],
  data: () => ({
    baseUrl: import.meta.env.VITE_DEFAULT_URL,
  }),
  methods : {
    triggerDialog(payload) {
      this.$emit('triggerDialog', payload);
    },
  },
};
</script>
<style scoped>
 /* make v-img show click mouse icon on mouse hover */
  .v-img:hover {
    cursor: pointer;
  }
  .widgetImg {
    transition: transform 0.2s;
  }
  

  .widgetImg:hover {
  transform: scale(1.05);
}
</style>
