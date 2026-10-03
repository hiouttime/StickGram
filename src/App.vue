<script setup lang="ts">
import { computed } from 'vue'
import {
  NConfigProvider,
  NMessageProvider,
  NDialogProvider,
  NNotificationProvider,
  NLoadingBarProvider,
  NLayout,
  NLayoutContent,
  NLayoutHeader,
  darkTheme,
} from 'naive-ui'
import type { GlobalThemeOverrides } from 'naive-ui'
import { useSettingsStore } from '@/stores/settings'
import { useIsMobile } from '@/composables/useResponsive'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import MobileNav from '@/components/layout/MobileNav.vue'

const settingsStore = useSettingsStore()
const isMobile = useIsMobile()

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
    <NMessageProvider>
      <NDialogProvider>
        <NNotificationProvider>
          <NLoadingBarProvider>

            <!-- Desktop Layout -->
            <div v-if="!isMobile" class="app-layout">
              <NLayoutHeader bordered class="app-layout-header">
                <AppHeader />
              </NLayoutHeader>
              <NLayout has-sider class="app-layout-body">
                <AppSidebar />
                <NLayoutContent :native-scrollbar="false" content-style="padding: 0;">
                  <router-view v-slot="{ Component }">
                    <keep-alive include="Home">
                      <component :is="Component" />
                    </keep-alive>
                  </router-view>
                </NLayoutContent>
              </NLayout>
            </div>

            <!-- Mobile Layout -->
            <div v-else class="app-layout">
              <NLayoutContent class="app-layout-mobile-content" :native-scrollbar="false" content-style="padding: 0; padding-bottom: 60px;">
                <router-view v-slot="{ Component }">
                  <keep-alive include="Home">
                    <component :is="Component" />
                  </keep-alive>
                </router-view>
              </NLayoutContent>
              <MobileNav />
            </div>

          </NLoadingBarProvider>
        </NNotificationProvider>
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}
#app {
  height: 100%;
}
.app-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.app-layout-header {
  flex-shrink: 0;
}
.app-layout-body {
  flex: 1;
  overflow: hidden;
}
.app-layout-mobile-content {
  flex: 1;
  overflow: auto;
}
</style>
