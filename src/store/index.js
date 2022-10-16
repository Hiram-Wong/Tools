//store/index.js
import { createPinia } from 'pinia';

const store = createPinia();

export { store };

export * from './modules/permission';
export * from './modules/setting';

export default store;