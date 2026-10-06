<template>
  <CanvasPreview :source="source" :playing="playing" :size="size" @ready="emit('ready', $event)" />
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { Artwork } from '@/core/artwork'
import { snapshot } from '@/shared/data/snapshot'
import CanvasPreview from '@/shared/canvas/CanvasPreview.vue'
import { getArtworkModule } from '../catalog'
import { createRenderer } from '../rendering'
const props = defineProps<{ artwork: Artwork; playing?: boolean; size?: number }>()
const emit = defineEmits<{ ready: [canvas: HTMLCanvasElement] }>()
const source = computed(() => {
  const artwork = snapshot(props.artwork),
    module = getArtworkModule(artwork.type)
  return {
    ...module.size(artwork.config),
    label: module.label(artwork.config, props.playing ?? false),
    duration: module.duration(artwork.config),
    prepare: () => createRenderer(artwork),
  }
})
</script>
