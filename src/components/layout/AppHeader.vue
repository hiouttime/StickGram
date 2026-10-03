<template>
  <n-layout-header bordered class="app-header">
    <div class="header-content">
      <div class="logo">
        <span class="emoji">🎨</span>
        <span class="title">StickGram</span>
      </div>
      <n-space align="center">
        <n-dropdown :options="languageOptions" @select="handleLanguageSelect">
          <n-button quaternary>
            <template #icon>
              <n-icon><LanguageOutline /></n-icon>
            </template>
          </n-button>
        </n-dropdown>
        <n-button quaternary @click="toggleTheme">
          <template #icon>
            <n-icon>
              <MoonOutline v-if="theme === 'light'" />
              <SunnyOutline v-else />
            </n-icon>
          </template>
        </n-button>
        <n-button type="primary" @click="goToCreate">
          {{ t('home.newProject') }}
        </n-button>
      </n-space>
    </div>
  </n-layout-header>
</template>

<script setup lang="ts">
import { NLayoutHeader, NSpace, NButton, NIcon, NDropdown } from 'naive-ui'
import { LanguageOutline, MoonOutline, SunnyOutline } from '@vicons/ionicons5'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { computed } from 'vue'

const { t, locale } = useI18n()
const router = useRouter()
const settingsStore = useSettingsStore()

const theme = computed(() => settingsStore.theme)

const languageOptions = [
  { label: 'English', key: 'en' },
  { label: '简体中文', key: 'zh-CN' }
]

function handleLanguageSelect(key: string) {
  settingsStore.locale = key as any
  locale.value = key
}

function toggleTheme() {
  settingsStore.theme = settingsStore.theme === 'light' ? 'dark' : 'light'
}

function goToCreate() {
  router.push('/create')
}
</script>

<style scoped>
.app-header {
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
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
  font-size: 20px;
  font-weight: bold;
}
.emoji {
  font-size: 24px;
}
</style>
