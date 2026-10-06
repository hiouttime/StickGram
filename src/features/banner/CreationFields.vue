<template>
  <n-form-item :label="t('banner.count')">
    <n-input-number
      :value="options.count"
      @update:value="
        (count) => {
          if (count) options.count = count
        }
      "
      :min="2"
      :max="10"
      :precision="0"
    />
  </n-form-item>
  <p class="hint">
    {{ t('banner.creationHint', { count: options.count, width: options.count! * 100 }) }}
  </p>
</template>
<script setup lang="ts">
import { NFormItem, NInputNumber } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { CreationOptions } from '../types'
const options = defineModel<CreationOptions>({ required: true })
const { t } = useI18n()
</script>
<style scoped>
.hint {
  font-size: 12px;
  line-height: 1.8;
  color: var(--n-text-color-3, #888);
}
</style>
