<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import {
  NConfigProvider,
  NMessageProvider,
  NDialogProvider,
  NNotificationProvider,
  NLoadingBarProvider,
  NLayout,
  NLayoutHeader,
  NLayoutSider,
  NLayoutContent,
  GlobalThemeOverrides,
  darkTheme
} from 'naive-ui'

const isMobile = ref(window.innerWidth < 768)

const updateDevice = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  window.addEventListener('resize', updateDevice)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateDevice)
})

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#2AABEE',
    primaryColorHover: '#3BBDF0',
    primaryColorPressed: '#1A9AD8',
    primaryColorSuppl: '#2AABEE',
  },
}

// In a real implementation this would come from the settings store
const currentTheme = computed(() => null)
</script>

<template>
  <NConfigProvider :theme="currentTheme" :theme-overrides="themeOverrides">
    <NMessageProvider>
      <NDialogProvider>
        <NNotificationProvider>
          <NLoadingBarProvider>
            
            <NLayout v-if="!isMobile" position="absolute">
              <NLayoutHeader bordered>AppHeader</NLayoutHeader>
              <NLayout has-sider position="absolute" style="top: 60px">
                <NLayoutSider bordered>Nav</NLayoutSider>
                <NLayoutContent>
                  <router-view v-slot="{ Component }">
                    <keep-alive include="Home">
                      <component :is="Component" />
                    </keep-alive>
                  </router-view>
                </NLayoutContent>
              </NLayout>
            </NLayout>

            <NLayout v-else position="absolute">
              <NLayoutContent style="bottom: 50px">
                <router-view v-slot="{ Component }">
                  <keep-alive include="Home">
                    <component :is="Component" />
                  </keep-alive>
                </router-view>
              </NLayoutContent>
              <div style="position: absolute; bottom: 0; width: 100%; height: 50px; background: var(--n-color);">MobileNav</div>
            </NLayout>

          </NLoadingBarProvider>
        </NNotificationProvider>
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<style scoped>
</style>
