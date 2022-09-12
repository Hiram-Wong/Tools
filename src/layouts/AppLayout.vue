<template>
	<div>
		<t-layout>
			<t-aside key="side">
				<LayoutSideNav :theme="settingStore.displayMode"/>
			</t-aside>
			<t-layout class="">
				<t-content>
					<t-layout class="tdesign-starter-layout">
						<LayoutContent />
					</t-layout>
				</t-content>
			</t-layout>
		</t-layout>
	</div>
</template>

<script setup>
import { useSettingStore } from '@/store';
import LayoutSideNav from './components/SideNav.vue';
import LayoutContent from './components/Content.vue';
const settingStore = useSettingStore();
// console.log(settingStore.displayMode)
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