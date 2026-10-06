<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import {
  NConfigProvider,
  NLayout,
  NLayoutContent,
  NLayoutHeader,
  NLayoutSider,
  NDrawer,
  NDrawerContent,
  darkTheme,
} from 'naive-ui'
import type { GlobalThemeOverrides } from 'naive-ui'
import { useSettingsStore } from '@/application/settings'
import { useMediaQuery } from '@/shared/browser/useMediaQuery'
import AppHeader from './components/AppHeader.vue'
import ProjectList from '@/features/projects/components/ProjectList.vue'

const settingsStore = useSettingsStore()
const { t, locale } = useI18n()
const route = useRoute()
const isMobile = useMediaQuery('(max-width: 767px)')
const showProjects = computed(() => route.name !== 'Home')
const projectDrawerOpen = ref(false)
watch([isMobile, showProjects], ([mobile, visible]) => {
  if (!mobile || !visible) projectDrawerOpen.value = false
})
watch(
  () => settingsStore.locale,
  (value) => {
    locale.value = value
  },
  { immediate: true },
)

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#2AABEE',
    primaryColorHover: '#3BBDF0',
    primaryColorPressed: '#1A9AD8',
    primaryColorSuppl: '#2AABEE',
  },
}

const currentTheme = computed(() => {
  return settingsStore.isDark ? darkTheme : null
})
</script>

<template>
  <NConfigProvider :theme="currentTheme" :theme-overrides="themeOverrides">
    <div class="app-layout">
      <NLayoutHeader bordered class="app-layout-header">
        <AppHeader
          :mobile="isMobile"
          :show-projects="showProjects"
          :projects-open="projectDrawerOpen"
          @open-projects="projectDrawerOpen = true"
        />
      </NLayoutHeader>
      <NLayout :has-sider="!isMobile && showProjects" class="app-layout-body">
        <NLayoutSider
          v-if="!isMobile && showProjects"
          bordered
          :width="264"
          :native-scrollbar="false"
        >
          <ProjectList />
        </NLayoutSider>
        <NLayoutContent :native-scrollbar="false" content-style="padding: 0;">
          <router-view />
        </NLayoutContent>
      </NLayout>
    </div>

    <NDrawer
      v-if="showProjects"
      v-model:show="projectDrawerOpen"
      placement="left"
      width="min(320px, 88vw)"
    >
      <NDrawerContent
        id="project-drawer"
        :title="t('nav.projects')"
        closable
        :body-content-style="{ padding: '0' }"
      >
        <ProjectList :heading="false" @select="projectDrawerOpen = false" />
      </NDrawerContent>
    </NDrawer>
  </NConfigProvider>
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}
#app {
  height: 100%;
}
.app-layout {
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
}
.app-layout-header {
  flex-shrink: 0;
}
.app-layout-body {
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
}
</style>
