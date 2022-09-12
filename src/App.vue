<template>
  <router-view :class="[mode]"></router-view>
</template>

<script setup>
import { computed,onMounted } from 'vue';
import { useSettingStore } from '@/store';
const config = {
  mode: 'auto',
}

const store = useSettingStore();

const mode = computed(() => {
  return store.displayMode;
});

onMounted(() => {
  store.updateConfig({ ...config });
});
</script>
  
<style lang="less" scoped>
@import '@/style/variables.less';

#nprogress .bar {
  background: var(--td-brand-color) !important;
}
</style>