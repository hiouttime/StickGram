<template>
  <div class="banner-templates">
    <button
      v-for="preset in bannerTemplates"
      :key="preset.id"
      type="button"
      class="banner-template"
      :class="{ active: modelValue === preset.id }"
      :aria-label="t(preset.label)"
      :aria-pressed="modelValue === preset.id"
      @click="emit('select', preset.id)"
    >
      <div class="template-art"><BannerPreview :config="{ ...preset.config, text, count }" /></div>
      <span class="template-caption">{{ t(preset.label) }}</span>
    </button>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { bannerTemplates } from './presets'
import BannerPreview from './Preview.vue'
defineProps<{ modelValue?: string; text: string; count: number }>()
const emit = defineEmits<{ select: [id: string] }>()
const { t } = useI18n()
</script>
<style scoped>
.banner-templates {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  width: 100%;
}
.banner-template {
  display: flex;
  flex-direction: column;
  min-width: 0;
  cursor: pointer;
  border: 1px solid var(--n-border-color, #ddd);
  border-radius: 12px;
  background: transparent;
  color: inherit;
  text-align: left;
  font: inherit;
  padding: 0;
  overflow: hidden;
}
.banner-template:hover,
.banner-template.active {
  border-color: #2aabee;
}
.banner-template.active {
  box-shadow: 0 0 0 1px #2aabee;
}
.banner-template:focus-visible {
  outline: 2px solid #2aabee;
  outline-offset: 3px;
}
.template-art {
  display: flex;
  align-items: center;
  padding: 14px 10px;
  min-height: 66px;
  background: var(--n-color-embedded, #f5f7fa);
}
.template-caption {
  padding: 8px 10px;
  font-size: 12px;
  font-weight: 600;
}
</style>
