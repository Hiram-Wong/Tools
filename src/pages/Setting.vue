<template>
  <div class="setting-container">
    <t-form ref="form" :data="formData" label-align="left">
      <t-form-item label="外观:" name="theme">
        <t-radio-group v-model="formData.mode">
          <div v-for="(item, index) in MODE_OPTIONS" :key="index" class="setting-layout-drawer">
            <div>
              <t-radio-button :key="index" :value="item.type">
                <component :is="getModeIcon(item.type)"/>
              </t-radio-button>
              <p :style="{ textAlign: 'center', marginTop: '8px' }">{{ item.text }}</p>
            </div>
          </div>
        </t-radio-group>
      </t-form-item>
    </t-form>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { useSettingStore } from '@/store';
import SettingDarkIcon from '@/assets/assets-setting-dark.svg';
import SettingLightIcon from '@/assets/assets-setting-light.svg';
import SettingAutoIcon from '@/assets/assets-setting-auto.svg';
const settingStore = useSettingStore();
const { mode } = settingStore;;
const STYLE_CONFIG= {
  mode,
};
const formData = ref({ ...STYLE_CONFIG });

const MODE_OPTIONS = [
  { type: 'light', text: '明亮' },
  { type: 'dark', text: '暗黑' },
  { type: 'auto', text: '跟随系统' },
];
const getModeIcon = (mode) => {
  if (mode === 'light') {
    return SettingLightIcon;
  }
  if (mode === 'dark') {
    return SettingDarkIcon;
  }
  return SettingAutoIcon;
};

watchEffect(() => {
  settingStore.updateConfig(formData.value);
});
</script>

<style lang="less" scoped>
@import '@/style/variables';
.setting-container {
  padding: 10px 36px;
}
:deep(.t-radio-group.t-size-m) {
  min-height: 24px;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
}

:deep(.t-radio-group.t-size-m .t-radio-button) {
  height: auto;
}

.setting-layout-drawer {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 10px 16px 0;

  :deep(.t-radio-button) {
    display: inline-flex;
    max-height: 78px;
    padding: 0;
    border-radius: @border-radius;
    border: 2px solid #e3e6eb;
    > .t-radio-button__label {
      display: inline-flex;
    }
  }

  :deep(.t-is-checked) {
    border: 2px solid var(--td-brand-color) !important;
  }

  :deep(.t-form__controls-content) {
    justify-content: end;
  }
}

:deep(.t-form__controls-content) {
  justify-content: end;
}


.setting-route-theme {
  :deep(.t-form__label) {
    min-width: 310px !important;
    color: var(--td-text-color-secondary);
  }
}

.setting-color-theme {
  .setting-layout-drawer {
    :deep(.t-radio-button) {
      height: 32px;
    }

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
