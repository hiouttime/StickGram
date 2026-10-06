<template>
  <div class="banner-preview" :style="{ maxWidth: `${maxWidth}px` }">
    <ArtworkPreview
      :artwork="{ type: 'sequential-emoji', config }"
      :playing="playing"
      @ready="emit('ready', $event)"
    />
    <div
      v-if="guides"
      class="slice-guides"
      :style="{ gridTemplateColumns: `repeat(${config.count}, 1fr)` }"
      aria-hidden="true"
    >
      <div v-for="n in config.count" :key="n">
        <span>{{ n }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { BannerConfig } from '@/core/models/banner'
import ArtworkPreview from '@/application/components/ArtworkPreview.vue'
withDefaults(
  defineProps<{ config: BannerConfig; playing?: boolean; guides?: boolean; maxWidth?: number }>(),
  { playing: false, guides: false, maxWidth: 1000 },
)
const emit = defineEmits<{ ready: [canvas: HTMLCanvasElement] }>()
</script>
<style scoped>
.banner-preview {
  position: relative;
  width: 100%;
  line-height: 0;
}
.slice-guides {
  position: absolute;
  inset: 0;
  display: grid;
  pointer-events: none;
}
.slice-guides > div + div {
  border-left: 1px dashed rgba(255, 255, 255, 0.75);
}
.slice-guides span {
  display: inline-block;
  font: 10px/1.5 system-ui;
  color: white;
  background: rgba(0, 0, 0, 0.45);
  padding: 1px 5px;
}
</style>
