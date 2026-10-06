<template>
  <n-tag size="small" :type="getExportFormat(format).animated ? 'success' : 'default'">
    {{ t(`exportFormat.${format}.name`) }}
  </n-tag>
</template>
<script setup lang="ts">
import { NTag } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { getExportFormat } from '../formats'
import type { ExportFormat } from '@/core/export'
defineProps<{ format: ExportFormat }>()
const { t } = useI18n()
</script>
