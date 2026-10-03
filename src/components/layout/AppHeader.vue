<template>
  <div class="app-header">
    <div class="header-content">
      <div class="logo" @click="router.push('/')">
        <span class="emoji">🎨</span>
        <span class="app-name">StickGram</span>
      </div>
      <n-space align="center" :size="8">
        <n-dropdown :options="languageOptions" @select="handleLanguageSelect">
          <n-button quaternary circle>
            <template #icon>
              <n-icon><LanguageOutline /></n-icon>
            </template>
          </n-button>
        </n-dropdown>
        <n-button quaternary circle @click="settingsStore.toggleTheme()">
          <template #icon>
            <n-icon>
              <MoonOutline v-if="!settingsStore.isDark" />
              <SunnyOutline v-else />
            </n-icon>
          </template>
        </n-button>
        <n-button type="primary" size="small" @click="router.push('/create')">
          {{ t('home.newProject') }}
        </n-button>
      </n-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NSpace, NButton, NIcon, NDropdown } from 'naive-ui'
import { LanguageOutline, MoonOutline, SunnyOutline } from '@vicons/ionicons5'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'

const { t, locale } = useI18n()
const router = useRouter()
const settingsStore = useSettingsStore()

const languageOptions = [
  { label: 'English', key: 'en' },
  { label: '简体中文', key: 'zh-CN' },
]

function handleLanguageSelect(key: string) {
  settingsStore.setLocale(key as 'en' | 'zh-CN')
  locale.value = key
}
</script>

<style scoped>
.app-header {
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid var(--n-border-color, #e0e0e6);
  background-color: var(--n-color, #fff);
}
.header-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}
.emoji {
  font-size: 24px;
}
.app-name {
  font-size: 20px;
  font-weight: bold;
}
</style>
