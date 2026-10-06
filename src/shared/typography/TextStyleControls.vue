<template>
  <n-form-item :label="`${t('textStyle.weight')} ${resolveFontWeight(fontFamily, fontWeight)}`">
    <n-slider
      :value="resolveFontWeight(fontFamily, fontWeight)"
      :min="100"
      :max="900"
      :step="100"
      :aria-label="t('textStyle.weight')"
      @update:value="emit('update:fontWeight', $event)"
    />
  </n-form-item>
  <n-form-item :label="`${t('textStyle.slant')} ${fontSlant ?? 0}°`">
    <n-slider
      :value="fontSlant ?? 0"
      :min="-20"
      :max="20"
      :step="1"
      :aria-label="t('textStyle.slant')"
      @update:value="emit('update:fontSlant', $event)"
    />
  </n-form-item>
</template>
<script setup lang="ts">
import { NFormItem, NSlider } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { resolveFontWeight } from './fonts'
defineProps<{ fontFamily: string; fontWeight?: number; fontSlant?: number }>()
const emit = defineEmits<{
  (e: 'update:fontWeight', value: number): void
  (e: 'update:fontSlant', value: number): void
}>()
const { t } = useI18n()
</script>
