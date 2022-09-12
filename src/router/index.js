import { useRoute, createRouter, createWebHashHistory } from 'vue-router';
import uniq from 'lodash/uniq';
import Layout from '@/layouts/AppLayout.vue';


// 存放固定的路由
const defaultRouterList = [
	{
		path: '/',
    redirect: '/diff',
		component: Layout,
		children: [{
			path: "/diff",
			name: 'diff',
			component: () => import('@/pages/Diff.vue'),
			meta: { title: '对比' }
		}]
	},
	{
		path: '/setting',
		component: Layout,
		children: [{
			path: "/setting",
			name: 'setting',
			component: () => import('@/pages/Setting.vue'),
			meta: { title: '设置' }
		}]
	}
];

export const allRoutes = [...defaultRouterList];

export const getRoutesExpanded = () => {
  const expandedRoutes = [];

  allRoutes.forEach((item) => {
    if (item.meta && item.meta.expanded) {
      expandedRoutes.push(item.path);
    }
    if (item.children && item.children.length > 0) {
      item.children
        .filter((child) => child.meta && child.meta.expanded)
        .forEach((child) => {
          expandedRoutes.push(item.path);
          expandedRoutes.push(`${item.path}/${child.path}`);
        });
    }
  });
  return uniq(expandedRoutes);
};

export const getActive = (maxLevel = 3) => {
  const route = useRoute();
  if (!route.path) {
    return '';
  }
  return route.path
    .split('/')
    .filter((_item, index) => index <= maxLevel && index > 0)
    .map((item) => `/${item}`)
    .join('');
};

const router = createRouter({
  history: createWebHashHistory(),
  routes: allRoutes,
  scrollBehavior() {
    return {
      el: '#app',
      top: 0,
      behavior: 'smooth',
    };
  },
});

export default router;