<template>
  <div class="canvas-preview" :style="{ width: size ? `${size}px` : '100%' }">
    <canvas
      ref="canvas"
      :width="source.width"
      :height="source.height"
      role="img"
      :aria-label="source.label"
    />
    <p v-if="error" class="error" role="alert">{{ error }}</p>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import type { PreviewSource, Renderer } from './types'

const props = withDefaults(
  defineProps<{ source: PreviewSource; playing?: boolean; size?: number }>(),
  {
    playing: false,
  },
)
const emit = defineEmits<{ ready: [canvas: HTMLCanvasElement] }>()
const canvas = ref<HTMLCanvasElement>(),
  error = ref('')
let renderer: Renderer | undefined,
  raf = 0,
  started = 0
function draw(progress = 0) {
  renderer?.draw(canvas.value!.getContext('2d')!, progress, props.playing)
}
function tick(time: number) {
  if (!started) started = time
  draw(((time - started) % props.source.duration) / props.source.duration)
  raf = requestAnimationFrame(tick)
}
function restart() {
  cancelAnimationFrame(raf)
  started = 0
  draw()
  if (props.playing) raf = requestAnimationFrame(tick)
}
onMounted(() => {
  watch(
    () => props.source,
    async (source, _, onCleanup) => {
      let current = true
      onCleanup(() => {
        current = false
      })
      error.value = ''
      try {
        const prepared = await source.prepare()
        if (!current) return
        renderer = prepared
        canvas.value!.width = prepared.width
        canvas.value!.height = prepared.height
        prepared.draw(canvas.value!.getContext('2d')!, 0, false)
        emit('ready', canvas.value!)
        restart()
      } catch (cause) {
        if (current) error.value = (cause as Error).message
      }
    },
    { immediate: true },
  )
})
watch(() => props.playing, restart)
onUnmounted(() => cancelAnimationFrame(raf))
</script>
<style scoped>
.canvas-preview {
  flex-shrink: 0;
  line-height: 0;
}
canvas {
  display: block;
  width: 100%;
  height: auto;
}
.error {
  color: #d03050;
  font-size: 12px;
  line-height: 1.5;
}
</style>
