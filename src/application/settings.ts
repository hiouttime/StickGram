import { computed, reactive, toRefs, watch } from 'vue'
import { defineStore } from 'pinia'
import { defaultSettings } from '@/core/settings'
import { loadSettings, saveSettings } from '@/infrastructure/storage/settings'
import { useMediaQuery } from '@/shared/browser/useMediaQuery'

export const useSettingsStore = defineStore('settings', () => {
  const settings = reactive(loadSettings(defaultSettings(navigator.language)))
  const systemDark = useMediaQuery('(prefers-color-scheme: dark)')
  const isDark = computed(() =>
    settings.theme === 'auto' ? systemDark.value : settings.theme === 'dark',
  )
  watch(settings, (value) => saveSettings(value), { flush: 'sync' })
  function toggleTheme() {
    settings.theme = isDark.value ? 'light' : 'dark'
  }
  return { ...toRefs(settings), isDark, toggleTheme }
})
