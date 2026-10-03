<template>
  <div class="text-emoji-preview-container" :style="{ width: size + 'px', height: size + 'px' }">
    <canvas
      ref="canvasRef"
      width="100"
      height="100"
      :style="{ width: '100%', height: '100%', backgroundColor }"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = withDefaults(defineProps<{
  textA?: string
  textB?: string
  gradientColors?: string[]
  size?: number
  duration?: number
  playing?: boolean
  backgroundColor?: string
  fontFamily?: string
}>(), {
  textA: '满山猴群',
  textB: '我腚最红',
  gradientColors: () => ['#FF69FF', '#6B5BFF', '#00BFFF'],
  size: 200,
  duration: 2000,
  playing: true,
  backgroundColor: 'transparent',
  fontFamily: 'sans-serif'
})

const emit = defineEmits<{
  (e: 'ready'): void
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId = 0
let startTime = 0

function drawFrame(progress: number) {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  ctx.clearRect(0, 0, 100, 100)
  
  let showA: boolean
  let transitionProgress: number
  
  if (progress < 0.4) {
    showA = true
    transitionProgress = 0
  } else if (progress < 0.6) {
    showA = true
    transitionProgress = (progress - 0.4) / 0.2
  } else if (progress < 0.9) {
    showA = false
    transitionProgress = 0
  } else {
    showA = false
    transitionProgress = (progress - 0.9) / 0.1
  }
  
  const currentText = showA ? props.textA : props.textB
  const nextText = showA ? props.textB : props.textA
  
  const chars = currentText.padEnd(4, ' ').slice(0, 4).split('')
  const fontSize = 38
  ctx.font = `bold ${fontSize}px ${props.fontFamily}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  const grad = ctx.createLinearGradient(0, 0, 100, 100)
  props.gradientColors.forEach((c, i) => {
    grad.addColorStop(i / (Math.max(1, props.gradientColors.length - 1)), c)
  })
  ctx.fillStyle = grad
  
  const positions = [
    [30, 30], [72, 30],
    [30, 72], [72, 72],
  ]
  
  for (let i = 0; i < 4; i++) {
    ctx.fillText(chars[i] || '', positions[i][0], positions[i][1])
  }
  
  if (transitionProgress > 0) {
    ctx.save()
    const wipePos = transitionProgress * 300 - 100
    
    const grad2 = ctx.createLinearGradient(wipePos - 150, 0, wipePos + 50, 100)
    const reversedColors = [...props.gradientColors].reverse()
    reversedColors.forEach((c, i) => {
      grad2.addColorStop(i / (Math.max(1, reversedColors.length - 1)), c)
    })
    ctx.fillStyle = grad2
    
    const nextChars = nextText.padEnd(4, ' ').slice(0, 4).split('')
    
    ctx.beginPath()
    ctx.moveTo(wipePos, -10)
    ctx.lineTo(wipePos + 200, -10)
    ctx.lineTo(wipePos + 200, 110)
    ctx.lineTo(wipePos - 100, 110)
    ctx.closePath()
    ctx.clip()
    
    for (let i = 0; i < 4; i++) {
      ctx.fillText(nextChars[i] || '', positions[i][0], positions[i][1])
    }
    ctx.restore()
  }
}

function animate(timestamp: number) {
  if (!startTime) startTime = timestamp
  let elapsed = timestamp - startTime
  
  if (!props.playing) {
    drawFrame(0)
    startTime = 0
  } else {
    const progress = (elapsed % props.duration) / props.duration
    drawFrame(progress)
    animationId = requestAnimationFrame(animate)
  }
}

watch(() => props.playing, (newVal) => {
  if (newVal) {
    startTime = performance.now()
    animationId = requestAnimationFrame(animate)
  } else {
    cancelAnimationFrame(animationId)
    drawFrame(0)
  }
})

watch([() => props.textA, () => props.textB, () => props.gradientColors, () => props.backgroundColor], () => {
  if (!props.playing) {
    drawFrame(0)
  }
}, { deep: true })

onMounted(() => {
  emit('ready')
  if (props.playing) {
    animationId = requestAnimationFrame(animate)
  } else {
    drawFrame(0)
  }
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
})

defineExpose({
  getCanvas: () => canvasRef.value,
  captureFrame: () => {
    if (!canvasRef.value) return null
    const ctx = canvasRef.value.getContext('2d')
    return ctx ? ctx.getImageData(0, 0, 100, 100) : null
  }
})
</script>

<style scoped>
.text-emoji-preview-container {
  display: inline-block;
}
</style>
