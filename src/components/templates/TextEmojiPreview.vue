<template>
  <div class="preview-container" :style="{ width: size + 'px', height: size + 'px' }">
    <canvas ref="canvasRef" width="100" height="100" style="width: 100%; height: 100%;" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

export type TransitionType = 'wipe-diagonal' | 'wipe-left' | 'wipe-up' | 'fade' | 'zoom-in' | 'none'

const props = withDefaults(defineProps<{
  // 'dual' = two alternating texts, 'single' = one static/animated text
  mode?: 'dual' | 'single'
  textA?: string
  textB?: string
  gradientColors?: string[]
  size?: number
  // total animation duration in ms (max 3000)
  duration?: number
  // hold time ratio for each text (0-1), rest is transition
  holdRatio?: number
  playing?: boolean
  backgroundColor?: string
  fontFamily?: string
  transition?: TransitionType
}>(), {
  mode: 'dual',
  textA: '满山猴群',
  textB: '我腚最红',
  gradientColors: () => ['#FF69FF', '#6B5BFF', '#00BFFF'],
  size: 200,
  duration: 2000,
  holdRatio: 0.35,
  playing: true,
  backgroundColor: 'transparent',
  fontFamily: 'sans-serif',
  transition: 'wipe-diagonal',
})

defineEmits<{ (e: 'ready'): void }>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let rafId = 0
let startTs = 0

// ─── Draw helpers ─────────────────────────────────────────────────────────────

function makeGradient(ctx: CanvasRenderingContext2D, colors: string[]) {
  const g = ctx.createLinearGradient(0, 0, 100, 100)
  colors.forEach((c, i) => g.addColorStop(i / Math.max(1, colors.length - 1), c))
  return g
}

function makeGradientReversed(ctx: CanvasRenderingContext2D, colors: string[]) {
  return makeGradient(ctx, [...colors].reverse())
}

/** Positions for 1-4 chars in a 2×2 grid, centred in a 100×100 canvas */
const POSITIONS_2x2 = [[28, 28], [72, 28], [28, 72], [72, 72]]
/** Position for a single char centred */
const POSITIONS_1 = [[50, 50]]

function positionsFor(n: number) {
  if (n <= 1) return POSITIONS_1
  // up to 4 in 2×2
  return POSITIONS_2x2.slice(0, n)
}

/**
 * Render text into an offscreen canvas and return it.
 * fontSize is auto-fitted based on char count.
 */
function renderTextOffscreen(
  text: string,
  gradient: CanvasGradient,
  fontFamily: string,
): HTMLCanvasElement {
  const oc = document.createElement('canvas')
  oc.width = 100; oc.height = 100
  const ctx = oc.getContext('2d')!

  const chars = [...text].slice(0, 4)
  const count = chars.length
  // single char → bigger font
  const fontSize = count <= 1 ? 68 : count <= 2 ? 52 : 38

  ctx.clearRect(0, 0, 100, 100)
  ctx.font = `bold ${fontSize}px ${fontFamily}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = gradient

  const positions = positionsFor(count)
  chars.forEach((ch, i) => {
    ctx.fillText(ch, positions[i][0], positions[i][1])
  })
  return oc
}

// ─── Transition composers ─────────────────────────────────────────────────────

/**
 * Compose two offscreen canvases onto ctx with a given transition type and progress (0→1).
 * At progress=0 → 100% from, at progress=1 → 100% to.
 */
function compositeTransition(
  ctx: CanvasRenderingContext2D,
  from: HTMLCanvasElement,
  to: HTMLCanvasElement,
  p: number,            // 0..1
  type: TransitionType,
) {
  ctx.clearRect(0, 0, 100, 100)

  if (type === 'none') {
    // hard cut at 0.5
    ctx.drawImage(p < 0.5 ? from : to, 0, 0)
    return
  }

  if (type === 'fade') {
    ctx.globalAlpha = 1
    ctx.drawImage(from, 0, 0)
    ctx.globalAlpha = p
    ctx.drawImage(to, 0, 0)
    ctx.globalAlpha = 1
    return
  }

  if (type === 'zoom-in') {
    // from shrinks, to grows
    ctx.save()
    const sc = 1 - p * 0.5
    ctx.globalAlpha = 1 - p
    ctx.translate(50, 50)
    ctx.scale(sc, sc)
    ctx.drawImage(from, -50, -50)
    ctx.restore()

    ctx.save()
    const sc2 = 0.5 + p * 0.5
    ctx.globalAlpha = p
    ctx.translate(50, 50)
    ctx.scale(sc2, sc2)
    ctx.drawImage(to, -50, -50)
    ctx.restore()
    ctx.globalAlpha = 1
    return
  }

  // Wipe transitions: draw "from" fully, then clip a region for "to"
  ctx.drawImage(from, 0, 0)
  ctx.save()
  ctx.beginPath()

  if (type === 'wipe-diagonal') {
    // diagonal band sweeps top-left → bottom-right
    // at p=0 edge is at -100, at p=1 edge is at 200
    const edge = p * 300 - 100           // leading edge of "to" region
    ctx.moveTo(edge, -5)
    ctx.lineTo(200, -5)
    ctx.lineTo(200, 105)
    ctx.lineTo(edge - 100, 105)
    ctx.closePath()
  } else if (type === 'wipe-left') {
    // simple horizontal wipe left→right
    const x = p * 100
    ctx.rect(x, 0, 100, 100)
  } else if (type === 'wipe-up') {
    // vertical wipe top→bottom
    const y = p * 100
    ctx.rect(0, y, 100, 100)
  }

  ctx.clip()
  ctx.drawImage(to, 0, 0)
  ctx.restore()
}

// ─── Main draw ────────────────────────────────────────────────────────────────

function drawFrame(progress: number) {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')!

  ctx.clearRect(0, 0, 100, 100)

  // Fill background if not transparent
  if (props.backgroundColor && props.backgroundColor !== 'transparent') {
    ctx.fillStyle = props.backgroundColor
    ctx.fillRect(0, 0, 100, 100)
  }

  const gradA = makeGradient(ctx, props.gradientColors)
  const gradB = makeGradientReversed(ctx, props.gradientColors)

  // Single-text mode: no switching, just draw textA with pulsing gradient
  if (props.mode === 'single') {
    ctx.drawImage(renderTextOffscreen(props.textA, gradA, props.fontFamily), 0, 0)
    return
  }

  // ── Dual mode ──
  // Timeline for one full cycle (A→B→A):
  // [0, holdA_end)          → hold A
  // [holdA_end, transAB_end)→ transition A→B
  // [transAB_end, holdB_end)→ hold B
  // [holdB_end, 1)          → transition B→A

  const transRatio = (1 - props.holdRatio * 2) / 2  // each transition takes this fraction
  const holdA_end = props.holdRatio
  const transAB_end = props.holdRatio + transRatio
  const holdB_end = props.holdRatio + transRatio + props.holdRatio
  // rest (1 - holdB_end) = transRatio  → B→A

  const offA = renderTextOffscreen(props.textA, gradA, props.fontFamily)
  const offB = renderTextOffscreen(props.textB, gradB, props.fontFamily)

  if (progress < holdA_end) {
    // Pure A
    ctx.drawImage(offA, 0, 0)
  } else if (progress < transAB_end) {
    // A → B
    const p = (progress - holdA_end) / transRatio
    compositeTransition(ctx, offA, offB, p, props.transition)
  } else if (progress < holdB_end) {
    // Pure B
    ctx.drawImage(offB, 0, 0)
  } else {
    // B → A
    const p = (progress - holdB_end) / transRatio
    compositeTransition(ctx, offB, offA, p, props.transition)
  }
}

// ─── Animation loop ───────────────────────────────────────────────────────────

function loop(ts: number) {
  if (!startTs) startTs = ts
  const progress = ((ts - startTs) % props.duration) / props.duration
  drawFrame(progress)
  rafId = requestAnimationFrame(loop)
}

function startLoop() {
  cancelAnimationFrame(rafId)
  startTs = 0
  rafId = requestAnimationFrame(loop)
}

function stopLoop() {
  cancelAnimationFrame(rafId)
  drawFrame(0)
}

watch(() => props.playing, (v) => v ? startLoop() : stopLoop())

// Redraw on any prop change (when paused)
watch(
  [() => props.textA, () => props.textB, () => props.gradientColors,
   () => props.backgroundColor, () => props.transition, () => props.mode,
   () => props.fontFamily],
  () => { if (!props.playing) drawFrame(0) },
  { deep: true },
)

onMounted(() => {
  if (props.playing) startLoop()
  else drawFrame(0)
})

onUnmounted(() => cancelAnimationFrame(rafId))

// ─── Expose ───────────────────────────────────────────────────────────────────

defineExpose({
  getCanvas: () => canvasRef.value,
  captureFrame: () => {
    const c = canvasRef.value
    return c ? c.getContext('2d')!.getImageData(0, 0, 100, 100) : null
  },
  restartLoop: startLoop,
})
</script>

<style scoped>
.preview-container {
  display: inline-block;
  flex-shrink: 0;
}
</style>
