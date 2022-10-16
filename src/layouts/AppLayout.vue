<template>
	<div>
		<t-layout>
			<t-aside key="side">
				<layout-sideNav :theme="settingStore.displayMode" :navData="sideMenu"/>
			</t-aside>
			<t-layout class="">
				<t-content>
					<t-layout class="tdesign-starter-layout">
						<layout-content/>
					</t-layout>
				</t-content>
			</t-layout>
		</t-layout>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useSettingStore, usePermissionStore } from '@/store';
import LayoutSideNav from './components/SideNav.vue'; //vue组件引入
// import LayoutSideNav from './components/SideNav.jsx'; //jsx组件引入
import LayoutContent from './components/Content.vue';

const settingStore = useSettingStore();
const permissionStore = usePermissionStore();
const { routers: menuRouters } = storeToRefs(permissionStore);

const sideMenu = computed(() => {
	let newMenuRouters = menuRouters.value;
	return newMenuRouters;
});
</script>

<style lang="less">
.light {
	.t-layout {
		background: #fbfbfb !important;
	}
	.t-default-menu {
		background: #fbfbfb !important;
	}
}

.dark {
	.t-layout {
		background: #000 !important;
	}

	.t-default-menu {
		background: #000 !important;
	}
}

.tdesign-starter-layout {
	height: calc(100vh);
	width: calc(100vw - 80px);
	overflow-y: scroll;
}
</style>