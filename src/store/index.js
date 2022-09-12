//store/index.js
import { createPinia,defineStore } from 'pinia'

const store = createPinia();

export { store };

export const useSettingStore = defineStore('setting', {
  state: () => {
    return {
			mode: 'auto'
    }
  },
	getters: {
    displayMode: (state) => {
      if (state.mode === 'auto') {
        //获取系统外观,media返回bol
        const media = window.matchMedia('(prefers-color-scheme:dark)');
        if (media.matches) {
          return 'dark';
        }
        return 'light';
      }
      return state.mode;
    },
  },
	actions: {
    async changeMode(mode) {
      let theme = mode;

      if (mode === 'auto') {
        const media = window.matchMedia('(prefers-color-scheme:dark)');
        if (media.matches) {
          theme = 'dark';
        } else {
          theme = 'light';
        }
      }
      const isDarkMode = theme === 'dark';

      document.documentElement.setAttribute('theme-mode', isDarkMode ? 'dark' : '');

    },
    changeBrandTheme(brandTheme) {
      document.documentElement.setAttribute('theme-color', brandTheme);
    },
    updateConfig(payload) {
      for (const key in payload) {
        if (payload[key] !== undefined) {
          this[key] = payload[key];
        }
        if (key === 'mode') {
          this.changeMode(payload[key]);
        }
        if (key === 'brandTheme') {
          this.changeBrandTheme(payload[key]);
        }
      }
    },
  },
})

export function getSettingStore() {
  return useSettingStore(store);
}

export default store;