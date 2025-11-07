<template>
          <v-card class="pa-4 avi" height="100%" max-height="587">
  <v-row>
          <v-col cols="12">
            <v-btn
              class="ma-2 text-none swPBtn"
              color="#fff"
              variant="outlined"
              rounded
              @click="changeTab('mySpaces')"
              ref="mySpaces"
              :class="{ 'v-btn--active': mySpacesActive }"
            >
              My Spaces
            </v-btn>
            <v-btn
              class="ma-2 text-none swPBtn"
              rounded
              ref="myFavs"
              @click="changeTab('favs')"
              :class="{ 'v-btn--active': favsActive }"
            >
              Favorites
            </v-btn>
            <v-btn
              class="ma-2 text-none swPBtn"
              rounded
              @click="changeTab('pop')"
              :class="{ 'v-btn--active': popularActive }"
            >
              Popular
            </v-btn>
            <v-btn
              class="ma-2 text-none swPBtn"
              rounded
              @click="changeTab('featured')"
              ref="featured"
              :class="{ 'v-btn--active': featuredActive }"
            >
              Featured
            </v-btn>
            <!-- arrow keys to next page use icons -->
            <v-btn
              class="ma-2 float-right swPBtn"
              id="hasNext"
              rounded
              :class="{ 'v-btn--disabled': rightActive }"
              @click="nextSpace"
            >
              <v-icon>mdi-arrow-right</v-icon>
            </v-btn>
            <v-btn
              class="ma-2 float-right swPBtn"
              id="hasPrev"
              rounded
              :class="{ 'v-btn--disabled': leftActive }"
              @click="prevSpace"
            >
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        
<v-container fluid class="spaces-container px-0">
          <v-row class="mb-2 spaces-grid">
            <div v-if="!isMsgEmpty">
              <v-col cols="12">
                <p class="d-flex justify-center">{{ msg }}</p>
              </v-col>
            </div>
            <v-col cols="3" v-for="space in spaces" :key="space.id" class="space-column">
              <v-card
                class="mx-auto space-card"
                height="96"
                max-width="128"
                ref="spaceCard"
                :style="{
                  backgroundImage: 'url(' + getSpaceThumbnail(space.spaceThumbnailSource, space.icon) + ')',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundBlendMode: 'multiply',
                  backgroundColor: 'rgba(0, 153, 0, 0.5)',
                  backgroundBlendMode: space.currentVisitors > 0 ? 'multiply' : 'normal',
                  backgroundColor: space.currentVisitors > 0 ? 'rgba(0, 153, 0, 0.5)' : 'transparent',
                }"
                @click="navigateToSpace(space.id)"
              >
              <!-- <v-btn v-if="!isFavorite(space.id)"
       icon
       small
       class="heart-btn"
       @click.stop="toggleFavorite(space.id)"
>
  <v-icon color="grey">mdi-heart</v-icon>
</v-btn>
<v-btn v-else-if="isFavorite(space.id)"
       icon
       small
       class="heart-btn"
       @click.stop="toggleFavorite(space.id)"
>
  <v-icon color="pink">mdi-heart</v-icon>
</v-btn> -->
          <!-- <v-btn
            icon
            small
            class="home-btn"
            @click.stop="toggleHome(space.id)"
          >
            <v-icon  color="blue">mdi-home</v-icon>
          </v-btn>-->
        </v-card> 
              <p
                class="d-flex font-weight-bold text-caption justify-center space-name"
                v-if="space.currentVisitors > 0"
              >
                {{ space.name }} ({{ space.currentVisitors }})
              </p>
              <v-tooltip v-model="show_t[space.id]" location="bottom" v-if="limit(space.name)">
                <template v-slot:activator="{ props }" >
                  <p
                    class="d-flex font-weight-bold text-caption justify-center space-name"
                    v-bind="props"
                  >
                    {{ limitSpaceName(space.name) }}
                  </p>
                </template>
                <span>{{ space.name }}</span>
              </v-tooltip>
              <p class="d-flex font-weight-bold text-caption justify-center space-name" v-else>{{ (space.name) }}</p>
            </v-col>
          </v-row>
        </v-container>
        </v-card>
</template>

<script>
export default {
  name: 'spacesLayout',
  
  props: {
    spaces: {
      type: Array,
      required: true,
    },

    mySpacesActive: {
      type: Boolean,
      required: true,
    },
    favsActive: {
      type: Boolean,
      required: true,
    },
    featuredActive: {
      type: Boolean,
      required: true,
    },
    popularActive: {
      type: Boolean,
      required: true,
    },

    rightActive: {
      type: Boolean,
      required: true,
    },

    leftActive: {
      type: Boolean,
      required: true,
    },
    msg: {
      type: String,
      required: true,
    },
  },
  data: () => ({
      show_t: {},
    
  }),
  emits: ['changeTab', 'nextSpace', 'prevSpace', 'navigateToSpace'],

  methods: {
    navigateToSpace(spaceId) {
      this.$emit('navigateToSpace', spaceId);
    },
    changeTab(tab) {
      this.$emit('changeTab', tab);
    },
    nextSpace() {
      this.$emit('nextSpace');
    },
    prevSpace() {
      this.$emit('prevSpace');
    },
    limitSpaceName(name) {
      return name.length > 17 ? name.substring(0, 17) + '...' : name;
    },
    limit(name){
      // returns t/f if name is longer than 17 characters
      return name.length > 17;
    },
    getSpaceThumbnail(thumbnailSource, iconSource) {
      return iconSource && iconSource.trim() !== '' ? iconSource : 
      (thumbnailSource && thumbnailSource.trim() !== '' ? thumbnailSource : 'no_img.png');
  },
  },

  computed: {
  isMsgEmpty() {
    return !this.msg || this.msg.trim() === '';
  },
}
}
</script>
<style>
.space-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px; /* Adjust the width as needed */
}
.spaces-container {
  overflow-y: auto;
  /* max-height: calc(587px - 80px); /* Adjust based on header height */
  scrollbar-width: thin;
  padding-top: 0px;
}

.spaces-grid {
  margin: 0;
}

.space-column {
  padding: 8px;
}
.space-card {
  transition: transform 0.2s;
}

.space-card:hover {
  transform: scale(1.05);
}
.heart-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 1;
  padding: 0;
  min-width: 24px;
  min-height: 24px;
  width: 25px !important;
  height: 25px !important;
}
.heart-btn .v-icon {
  font-size: 16px;
}

.home-btn
{
  position: absolute;
  top: 4px;
  left: 4px;
  z-index: 1;
  padding: 0;
  min-width: 24px;
  min-height: 24px;
  width: 25px !important;
  height: 25px !important;
}
.home-btn .v-icon {
  font-size: 16px;
}
</style>
