<template>
  <div class="export-controls">
    <n-button type="primary" :loading="loading" :disabled="loading" @click="emit('export')">
      <template #icon>
        <n-icon><DownloadOutline /></n-icon>
      </template>
      {{ label }}
    </n-button>
    <a v-if="url" :href="url" :download="name">{{ t('common.download') }} {{ name }}</a>
    <p v-if="error" role="alert">{{ error }}</p>
  </div>
</template>
<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui'
import { DownloadOutline } from '@vicons/ionicons5'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import type { ExportFormat } from '@/core/export'
import { getExportFormat } from '../formats'
const props = defineProps<{
  format: ExportFormat
  bundle?: boolean
  loading: boolean
  url: string
  name: string
  error: string
}>()
const emit = defineEmits<{ export: [] }>()
const { t } = useI18n()
const label = computed(() =>
  props.bundle
    ? t('export.bundle', { format: t(`exportFormat.${props.format}.name`) })
    : t('export.file', { extension: getExportFormat(props.format).displayName }),
)
</script>
<style scoped>
.export-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
}
p {
  width: 100%;
  color: #d03050;
  font-size: 12px;
  margin: 0;
}
</style>
