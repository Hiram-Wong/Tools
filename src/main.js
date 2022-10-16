import { createApp } from 'vue';

// vite 按需加载
// import TDesign from 'tdesign-vue-next';

// jsx加载报错,手动加载
// import { 
//   Menu as TMenu,
//   MenuItem as TMenuItem,
//   Submenu as TSubmenu,
//   Icon as TIcon
// } from 'tdesign-vue-next';

import 'tdesign-vue-next/es/style/index.css';

import { store } from './store';
import router from './router';
import '@/style/index.less';
import './permission';
import App from './App.vue';

const app = createApp(App);

// app.use(TDesign);

// app.use(TMenu);
// app.use(TMenuItem);
// app.use(TSubmenu);
// app.use(TIcon);

app.use(store);
app.use(router);

app.mount('#app');