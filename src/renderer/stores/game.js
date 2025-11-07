import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useGameStore = defineStore({
  id: 'game',
  options: {
    // If you want to disable the auto-injection of this store in a component
    // This is useful if you want to use this store inside another store
    // without injecting it by default in a component
    // inject: []
  },
  state: () => {
    const initialState = reactive({
      webServiceUrl: null,
      contentUrl: null,
      configUrl: null,
      avatarImagesPath: null,
      wwwRoot: null,
      webassetsPath: null,
      config: null,
    });
    window.storage.getItem('GAME_INFO').then((value) => {
      if (value) {
        const storedGameInfo = JSON.parse(value);
        for (const key in storedGameInfo) {
          initialState[key] = storedGameInfo[key];
        }
      }
    });
  
    return initialState;
  },
    actions: {
    updateState(data) {
      let newGameInfo = { ...this.$state, ...data };
      window.storage.removeItem('GAME_INFO');
      window.storage.setItem('GAME_INFO', JSON.stringify(newGameInfo));
      this.$reset();

    },
    async storeInfo(data) {
      this.updateState(
        {
          webServiceUrl: data.webServiceUrl,
          contentUrl: data.contentUrl,
          configUrl: data.configUrl,
          avatarImagesPath: data.avatarImagesPath,
          wwwRoot: data.wwwRoot,
          webassetsPath: data.webassetsPath,
          config: data.config,
        }
      );
    },
      
  },
});