<template>
  <div class="project-demo">
    <ArtworkPreview :artwork="artwork" :size="module.demoSize" :playing="playing" />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ArtworkType } from '@/core/artwork'
import type { CreationOptions } from '@/features/types'
import { createArtwork, getArtworkModule } from '@/application/catalog'
import ArtworkPreview from '@/application/components/ArtworkPreview.vue'
const props = withDefaults(
  defineProps<{ type: ArtworkType; playing?: boolean; options?: CreationOptions }>(),
  { playing: true },
)
const { locale } = useI18n()
const module = computed(() => getArtworkModule(props.type))
const artwork = computed(() =>
  createArtwork(props.type, { ...props.options, locale: locale.value as 'zh-CN' | 'en' }),
)
</script>
<style scoped>
.project-demo {
  min-height: 184px;
  padding: 22px;
  border-radius: 12px;
  background: var(--n-color-embedded, #f5f7fa);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
</style>
