<template>
  <n-tag :size="size" :type="tagType" class="format-badge">
    {{ t(`stickerFormat.${format}`) }}
  </n-tag>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NTag } from 'naive-ui'
import type { StickerFormat, ProjectType } from '@/types/project'

const props = withDefaults(defineProps<{
  format: StickerFormat
  type: ProjectType
  size?: 'small' | 'medium' | 'large'
}>(), {
  size: 'small'
})

const { t } = useI18n()

const tagType = computed(() => {
  switch (props.format) {
    case 'static': return 'default'
    case 'animated': return 'info'
    case 'video': return 'success'
    default: return 'default'
  }
})
</script>

<style scoped>
.format-badge {
  text-transform: capitalize;
}
</style>
