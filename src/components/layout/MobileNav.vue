<template>
  <div class="mobile-nav">
    <div
      v-for="item in navItems"
      :key="item.path"
      class="nav-item"
      :class="{ active: route.path === item.path }"
      @click="router.push(item.path)"
    >
      <n-icon size="24" :component="item.icon" />
      <span class="label">{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { NIcon } from 'naive-ui'
import { HomeOutline, GridOutline, SettingsOutline } from '@vicons/ionicons5'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const navItems = computed(() => [
  { path: '/', label: t('nav.home'), icon: HomeOutline },
  { path: '/templates', label: t('nav.templates'), icon: GridOutline },
  { path: '/settings', label: t('nav.settings'), icon: SettingsOutline }
])
</script>

<style scoped>
.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  display: flex;
  background-color: var(--n-color);
  border-top: 1px solid var(--n-border-color);
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 100;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--n-text-color-3);
  cursor: pointer;
  transition: color 0.3s;
}

.nav-item.active {
  color: var(--n-primary-color);
}

.label {
  font-size: 12px;
  margin-top: 2px;
}
</style>
