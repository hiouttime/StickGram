<template>
  <div class="settings-page">
    <h1 class="title">{{ t('settings.title') }}</h1>

    <n-card class="settings-card">
      <n-form label-placement="left" label-width="150" require-mark-placement="right-hanging">
        
        <!-- General Section -->
        <h3 class="section-title">{{ t('settings.general') }}</h3>
        
        <n-form-item :label="t('settings.language')">
          <n-select
            v-model:value="settingsStore.locale"
            :options="languageOptions"
            @update:value="handleLanguageChange"
          />
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

        <!-- Editor Section -->
        <h3 class="section-title">{{ t('settings.editor') }}</h3>

        <n-form-item :label="t('settings.defaultFormat')">
          <n-select v-model:value="settingsStore.defaultFormat" :options="formatOptions" />
        </n-form-item>

        <n-form-item :label="t('settings.autoSave')">
          <n-switch v-model:value="settingsStore.autoSave" />
        </n-form-item>

        <n-divider />

        <!-- About Section -->
        <h3 class="section-title">{{ t('settings.about') }}</h3>
        <div class="about-info">
          <p>{{ t('settings.version') }}: 0.1.0</p>
          <a href="#" class="github-link">GitHub</a>
        </div>

        <n-divider />

        <!-- Danger Zone -->
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
  NCard, NForm, NFormItem, NSelect, NRadioGroup, NRadio, 
  NSpace, NDivider, NSwitch, NButton, useDialog 
} from 'naive-ui'
import { useSettingsStore } from '@/stores/settings'

const { t, locale } = useI18n()
const settingsStore = useSettingsStore()
// In a real app we'd configure naive-ui's dialog provider
// const dialog = useDialog()

const languageOptions = [
  { label: 'English', value: 'en' },
  { label: '简体中文', value: 'zh-CN' }
]

const formatOptions = computed(() => [
  { label: t('stickerFormat.static'), value: 'static' },
  { label: t('stickerFormat.animated'), value: 'animated' },
  { label: t('stickerFormat.video'), value: 'video' }
])

function handleLanguageChange(val: string) {
  locale.value = val
}

function handleClearData() {
  const confirmed = window.confirm(t('settings.clearDataConfirm'))
  if (confirmed) {
    localStorage.clear()
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

.about-info {
  color: var(--n-text-color-2);
}

.github-link {
  color: var(--n-primary-color);
  text-decoration: none;
}
</style>
