import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { StickerFormat } from '../types/project';
import { loadFromStorage, saveToStorage } from '../utils/storage';

const STORAGE_KEY = 'stickgram-settings';

interface SettingsState {
  locale: 'zh-CN' | 'en';
  theme: 'light' | 'dark' | 'auto';
  autoSave: boolean;
  autoSaveInterval: number;
  defaultFormat: StickerFormat;
}

const defaultState: SettingsState = {
  locale: navigator.language.startsWith('zh') ? 'zh-CN' : 'en',
  theme: 'auto',
  autoSave: true,
  autoSaveInterval: 30000,
  defaultFormat: 'static',
};

export const useSettingsStore = defineStore('settings', () => {
  const initialState = loadFromStorage<SettingsState>(STORAGE_KEY, defaultState);

  const locale = ref<'zh-CN' | 'en'>(initialState.locale);
  const theme = ref<'light' | 'dark' | 'auto'>(initialState.theme);
  const autoSave = ref(initialState.autoSave);
  const autoSaveInterval = ref(initialState.autoSaveInterval);
  const defaultFormat = ref<StickerFormat>(initialState.defaultFormat);

  const resolvedTheme = computed(() => {
    if (theme.value === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme.value;
  });

  const isDark = computed(() => resolvedTheme.value === 'dark');

  function setLocale(newLocale: 'zh-CN' | 'en') {
    locale.value = newLocale;
  }

  function setTheme(newTheme: 'light' | 'dark' | 'auto') {
    theme.value = newTheme;
  }

  function toggleTheme() {
    const current = resolvedTheme.value;
    theme.value = current === 'light' ? 'dark' : 'light';
  }

  function resetSettings() {
    locale.value = defaultState.locale;
    theme.value = defaultState.theme;
    autoSave.value = defaultState.autoSave;
    autoSaveInterval.value = defaultState.autoSaveInterval;
    defaultFormat.value = defaultState.defaultFormat;
  }

  watch([locale, theme, autoSave, autoSaveInterval, defaultFormat], () => {
    saveToStorage<SettingsState>(STORAGE_KEY, {
      locale: locale.value,
      theme: theme.value,
      autoSave: autoSave.value,
      autoSaveInterval: autoSaveInterval.value,
      defaultFormat: defaultFormat.value,
    });
  }, { deep: true });

  return {
    locale,
    theme,
    autoSave,
    autoSaveInterval,
    defaultFormat,
    resolvedTheme,
    isDark,
    setLocale,
    setTheme,
    toggleTheme,
    resetSettings
  };
});
