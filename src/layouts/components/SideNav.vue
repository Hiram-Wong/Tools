<template>
  <div class="tdesign-starter-sidebar-layout tdesign-starter-sidebar-compact">
    <t-menu :theme="props.theme" defaultValue="diff" collapsed  class="tdesign-block-column">
      <t-menu-item value="logo" disabled style="margin-top: 5px">
        <template #icon>
          <img width="32" src="@/assets/icon.png" alt="logo">
        </template>
        icon
      </t-menu-item>
      <t-menu-item to="/diff" value="diff">
        <template #icon>
          <t-icon name="relativity" />
        </template>
        对比
      </t-menu-item>
      <t-menu-item to="/setting" value="setting">
        <template #icon>
          <t-icon name="setting" />
        </template>
        设置
      </t-menu-item>
    </t-menu>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getActive } from '@/router';
const props = defineProps(['theme']);
const active = computed(() => getActive());
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