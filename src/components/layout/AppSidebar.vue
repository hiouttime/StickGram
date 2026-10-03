<template>
  <n-layout-sider
    bordered
    collapse-mode="width"
    :collapsed-width="64"
    :width="200"
    show-trigger
    class="app-sidebar"
  >
    <n-menu
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
      :value="activeKey"
      @update:value="handleUpdateValue"
    />
  </n-layout-sider>
</template>

<script setup lang="ts">
import { h, computed } from 'vue'
import { NLayoutSider, NMenu, NIcon } from 'naive-ui'
import { HomeOutline, GridOutline, SettingsOutline } from '@vicons/ionicons5'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions = computed(() => [
  {
    label: t('nav.home'),
    key: '/',
    icon: renderIcon(HomeOutline)
  },
  {
    label: t('nav.templates'),
    key: '/templates',
    icon: renderIcon(GridOutline)
  },
  {
    label: t('nav.settings'),
    key: '/settings',
    icon: renderIcon(SettingsOutline)
  }
])

const activeKey = computed(() => route.path)

function handleUpdateValue(key: string) {
  router.push(key)
}
</script>

<style scoped>
.app-sidebar {
  height: calc(100vh - 56px);
  margin-top: 56px;
}
</style>
