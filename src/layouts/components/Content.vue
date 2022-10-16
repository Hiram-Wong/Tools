<template>
	<router-view v-slot="{ Component }">
		<transition name="fade" mode="out-in">
			<keep-alive>
				<component :is="Component" :key="activeRouteFullPath" style="margin-top: 15px" />
			</keep-alive>
		</transition>
	</router-view>
</template>
  
<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const activeRouteFullPath = computed(() => {
	const router = useRouter();
	return router.currentRoute.value.fullPath;
});
</script>
<style lang="less" scoped>
@import '@/style/variables';

.fade-leave-active,
.fade-enter-active {
	transition: opacity @anim-duration-slow @anim-time-fn-easing;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}
</style>