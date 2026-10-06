<template>
  <div class="app-header" :class="{ mobile }">
    <div class="header-brand">
      <n-button
        v-if="mobile && showProjects"
        quaternary
        circle
        :aria-label="t('nav.projects')"
        :aria-expanded="projectsOpen"
        aria-controls="project-drawer"
        @click="emit('openProjects')"
      >
        <template #icon>
          <n-icon><MenuOutline /></n-icon>
        </template>
      </n-button>
      <RouterLink to="/" class="logo" aria-label="StickGram">
        <span class="emoji">🎨</span>
        <span class="app-name">StickGram</span>
      </RouterLink>
    </div>
    <nav class="header-nav" :aria-label="t('nav.main')">
      <RouterLink
        to="/"
        class="nav-link"
        :class="{ active: route.path === '/' }"
        :aria-current="route.path === '/' ? 'page' : undefined"
      >
        <n-icon><HomeOutline /></n-icon>
        <span>{{ t('nav.home') }}</span>
      </RouterLink>
      <RouterLink
        to="/settings"
        class="nav-link"
        :class="{ active: route.path === '/settings' }"
        :aria-current="route.path === '/settings' ? 'page' : undefined"
      >
        <n-icon><SettingsOutline /></n-icon>
        <span>{{ t('nav.settings') }}</span>
      </RouterLink>
    </nav>
    <div class="header-actions">
      <n-dropdown v-if="!mobile" :options="languageOptions" @select="handleLanguageSelect">
        <n-button quaternary circle :aria-label="t('settings.language')">
          <template #icon>
            <n-icon><LanguageOutline /></n-icon>
          </template>
        </n-button>
      </n-dropdown>
      <n-button
        v-if="!mobile"
        quaternary
        circle
        :aria-label="t('settings.theme')"
        @click="settingsStore.toggleTheme()"
      >
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
    </div>
  </div>
</template>
<script setup lang="ts">
import { NButton, NIcon, NDropdown } from 'naive-ui'
import {
  LanguageOutline,
  MoonOutline,
  SunnyOutline,
  HomeOutline,
  SettingsOutline,
  MenuOutline,
} from '@vicons/ionicons5'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useSettingsStore } from '@/application/settings'
withDefaults(defineProps<{ mobile?: boolean; projectsOpen?: boolean; showProjects?: boolean }>(), {
  showProjects: true,
})
const emit = defineEmits<{ (e: 'openProjects'): void }>()
const { t } = useI18n(),
  router = useRouter(),
  route = useRoute(),
  settingsStore = useSettingsStore()
const languageOptions = [
  { label: 'English', key: 'en' },
  { label: '简体中文', key: 'zh-CN' },
]
function handleLanguageSelect(key: string) {
  settingsStore.locale = key as 'en' | 'zh-CN'
}
</script>
<style scoped>
.app-header {
  min-height: 56px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 24px;
  padding: 8px 20px;
}
.header-brand,
.header-actions,
.header-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}
.header-nav {
  justify-self: end;
}
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  user-select: none;
  color: inherit;
  text-decoration: none;
}
.emoji {
  font-size: 24px;
}
.app-name {
  font-size: 20px;
  font-weight: bold;
}
.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border-radius: 8px;
  color: inherit;
  text-decoration: none;
  font-size: 13px;
  white-space: nowrap;
}
.nav-link:hover {
  background: rgba(42, 171, 238, 0.06);
}
.nav-link.active {
  color: #2aabee;
  background: rgba(42, 171, 238, 0.1);
}
.nav-link:focus-visible,
.logo:focus-visible {
  outline: 2px solid #2aabee;
  outline-offset: 3px;
}
.mobile {
  grid-template-columns: 1fr auto;
  gap: 8px 12px;
  padding: 10px 12px;
}
.mobile .header-brand {
  grid-column: 1;
  grid-row: 1;
}
.mobile .header-actions {
  grid-column: 2;
  grid-row: 1;
}
.mobile .header-nav {
  grid-column: 1 / -1;
  grid-row: 2;
  justify-self: stretch;
  gap: 8px;
}
.mobile .nav-link {
  flex: 1;
  justify-content: center;
}
.mobile .app-name {
  font-size: 18px;
}
</style>
