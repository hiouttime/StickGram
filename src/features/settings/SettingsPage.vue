<template>
  <div class="settings-page">
    <h1 class="title">{{ t('settings.title') }}</h1>

    <n-card class="settings-card">
      <n-form label-placement="left" label-width="150" require-mark-placement="right-hanging">
        <h3 class="section-title">{{ t('settings.general') }}</h3>

        <n-form-item :label="t('settings.language')">
          <n-select v-model:value="settingsStore.locale" :options="languageOptions" />
        </n-form-item>

        <n-form-item :label="t('settings.theme')">
          <n-radio-group v-model:value="settingsStore.theme" name="theme-radiogroup">
            <n-space>
              <n-radio value="light">{{ t('settings.light') }}</n-radio>
              <n-radio value="dark">{{ t('settings.dark') }}</n-radio>
              <n-radio value="auto">{{ t('settings.auto') }}</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>

        <n-divider />

        <h3 class="section-title">{{ t('settings.editor') }}</h3>

        <n-form-item :label="t('settings.defaultFormat')">
          <n-select v-model:value="settingsStore.defaultFormat" :options="formatOptions" />
        </n-form-item>

        <n-divider />

        <h3 class="section-title danger">{{ t('settings.clearData') }}</h3>
        <p class="desc">{{ t('settings.clearDataDesc') }}</p>
        <n-button type="error" @click="handleClearData">
          {{ t('settings.clearData') }}
        </n-button>
      </n-form>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  NCard,
  NForm,
  NFormItem,
  NSelect,
  NRadioGroup,
  NRadio,
  NSpace,
  NDivider,
  NButton,
} from 'naive-ui'
import { clearAppStorage } from '@/infrastructure/storage/clear'
import { exportFormatIds } from '@/application/formats'
import { useSettingsStore } from '@/application/settings'

const { t } = useI18n()
const settingsStore = useSettingsStore()

const languageOptions = [
  { label: 'English', value: 'en' },
  { label: '简体中文', value: 'zh-CN' },
]

const formatOptions = computed(() =>
  exportFormatIds.map((value) => ({ label: t(`exportFormat.${value}.name`), value })),
)

function handleClearData() {
  const confirmed = window.confirm(t('settings.clearDataConfirm'))
  if (confirmed) {
    clearAppStorage()
    window.location.reload()
  }
}
</script>

<style scoped>
.settings-page {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 24px;
}

.section-title {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 18px;
}

.section-title.danger {
  color: var(--n-error-color);
}

.desc {
  margin-bottom: 16px;
  color: var(--n-text-color-3);
}
</style>
