<template>
  <div class="tdesign-starter-sidebar-layout tdesign-starter-sidebar-compact">
    <t-menu :theme="theme" :value="active" collapsed class="tdesign-block-column">
      <t-menu-item value="logo" disabled style="margin-top: 5px">
        <template #icon>
          <asset-logo />
        </template>
        Tool
      </t-menu-item>
      <t-menu-item v-for="(item, index) in list" :key="index" :name="item.path" :value="getPath(active, item)" :to="item.path">
        <template #icon>
          <t-icon :name="item.icon" />
        </template>
        {{ item.title }}
      </t-menu-item>
    </t-menu>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getActive } from '@/router';
import AssetLogo from '@/assets/icon.svg?component';
const { navData, theme } = defineProps(['navData','theme']);
const active = computed(() => getActive());
const getPath = (active, item) => {
  if (active.startsWith(item.path)) {
    return active;
  }
  return item.meta?.single ? item.redirect : item.path;
};

const list = computed(() => {
  return getMenuList(navData);
});

const getMenuList = (list, basePath) => {
  if (!list) {
    return [];
  }
  // 如果meta中有orderNo则按照从小到大排序
  list.sort((a, b) => {
    return (a.meta?.orderNo || 0) - (b.meta?.orderNo || 0);
  });
  
  return list
    .map((item) => {
      const path = basePath ? `${basePath}/${item.path}` : item.path;
      return {
        path,
        title: item.meta?.title,
        icon: item.meta?.icon || '',
        children: getMenuList(item.children, path),
        meta: item.meta,
        redirect: item.redirect,
      };
    })
    .filter((item) => item.meta && item.meta.hidden !== true);
};
</script>

<style lang="less">
@import '@/style/variables';
.t-layout__sider {
  width: fit-content;
}

.tdesign-starter-sidebar-layout {
  height: 100%;
}

.tdesign-starter-sidebar-compact {
  width: 80px;
}

.light {
  .t-default-menu:not(.t-menu--dark) .t-menu__item.t-is-active:not(.t-is-opened) {
    background-color: #fff;
    color: #000;
    box-shadow: @box-shadow-light-1;
    border-radius: @border-radius-10;
  }
  .t-default-menu .t-menu__item.t-is-active:not(.t-is-opened) .t-icon {
    color: #000;
  }
  .tdesign-starter-sidebar-compact {
    background: #fbfbfb !important;
  }
}

.dark {
  .t-default-menu .t-menu__item.t-is-active:not(.t-is-opened) {
    color: #fff;
    box-shadow: @box-shadow-dark-1;
    border-radius: @border-radius-10;
  }
  .t-default-menu.t-menu--dark .t-menu__item.t-is-active:not(.t-is-opened) {
    background-color: #161616;
  }
  .t-default-menu .t-menu__item.t-is-active:not(.t-is-opened) .t-icon {
    color: #fff;
  }
  .tdesign-starter-sidebar-compact {
    background: #000 !important;
  }
}

.t-default-menu.t-is-collapsed .t-menu .t-menu__item {
  padding: 0;
  width: 42px;
  height: 42px;
  margin-bottom: 21px;
  border-radius: @border-radius-10 !important;
}

.tdesign-block-column {
  display: flex;
  flex-direction: row;
  grid-row: 40px;
}

.t-menu {
  width: 80px !important;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>