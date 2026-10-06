import type { TextEmojiConfig } from '@/core/models/textEmoji'
import { textFont, applyTextSlant, textSlantShear } from '@/shared/typography/fonts'
import { drawTextTransition } from './transitions'
import type { DrawFrame } from '@/shared/canvas/types'

function makeGrad(ctx: CanvasRenderingContext2D, colors: string[]) {
  const g = ctx.createLinearGradient(0, 0, 100, 100)
  colors.forEach((c, i) => g.addColorStop(i / (colors.length - 1), c))
  return g
}

/** Render text onto a 100×100 offscreen canvas */
function renderText(
  text: string,
  colors: string[],
  fontFamily: string,
  style: TextEmojiConfig,
  reverseGrad = false,
): HTMLCanvasElement {
  const oc = document.createElement('canvas')
  oc.width = 100
  oc.height = 100
  const ctx = oc.getContext('2d')!

  const cols = reverseGrad ? [...colors].reverse() : colors
  ctx.fillStyle = makeGrad(ctx, cols)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  applyTextSlant(ctx, style.fontSlant, 50)
  // Reserve horizontal space for the slanted glyphs, including outer rows.
  function fits(items: { text: string; x: number; y: number }[], size: number) {
    ctx.font = textFont(fontFamily, size, style.fontWeight)
    const shear = textSlantShear(style.fontSlant)
    return items.every((item) => {
      const metrics = ctx.measureText(item.text)
      const top = item.y - metrics.actualBoundingBoxAscent
      const bottom = item.y + metrics.actualBoundingBoxDescent
      const offsets = [shear * (top - 50), shear * (bottom - 50)]
      return (
        item.x - metrics.actualBoundingBoxLeft + Math.min(...offsets) >= 4 &&
        item.x + metrics.actualBoundingBoxRight + Math.max(...offsets) <= 96
      )
    })
  }
  if (/[A-Za-z]/.test(text) && !/\p{Script=Han}/u.test(text)) {
    const words = text.trim().split(/\s+/)
    const middle = Math.ceil(words.length / 2)
    const lines =
      words.length > 1 ? [words.slice(0, middle).join(' '), words.slice(middle).join(' ')] : words
    let size = lines.length > 1 ? 34 : 48
    ctx.font = textFont(fontFamily, size, style.fontWeight)
    const items = lines.map((line, i) => ({
      text: line,
      x: 50,
      y: lines.length === 1 ? 50 : 30 + i * 40,
    }))
    while (size > 8 && !fits(items, size)) size -= 0.5
    ctx.font = textFont(fontFamily, size, style.fontWeight)
    items.forEach((item) => ctx.fillText(item.text, item.x, item.y))
    return oc
  }

  const chars = [...text].slice(0, 4)
  const n = chars.length
  let fontSize = n <= 1 ? 68 : n <= 2 ? 52 : 38

  ctx.font = textFont(fontFamily, fontSize, style.fontWeight)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const POS: [number, number][] =
    n <= 1
      ? [[50, 50]]
      : [
          [28, 28],
          [72, 28],
          [28, 72],
          [72, 72],
        ]

  const items = chars.map((ch, i) => ({ text: ch, x: POS[i][0], y: POS[i][1] }))
  while (fontSize > 8 && !fits(items, fontSize)) fontSize -= 0.5
  ctx.font = textFont(fontFamily, fontSize, style.fontWeight)
  items.forEach((item) => ctx.fillText(item.text, item.x, item.y))
  return oc
}

/** Cache both text layers once per configuration, shared by previews and exports. */
export function createTextEmojiRenderer(config: TextEmojiConfig): DrawFrame {
  const offA = renderText(config.textA, config.gradientColors, config.fontFamily, config)
  const offB = renderText(config.textB, config.gradientColors, config.fontFamily, config, true)
  const transitionCanvas = document.createElement('canvas')
  transitionCanvas.width = transitionCanvas.height = 100
  return (ctx, progress, animated) => {
    ctx.clearRect(0, 0, 100, 100)
    if (config.backgroundColor !== 'transparent') {
      ctx.fillStyle = config.backgroundColor
      ctx.fillRect(0, 0, 100, 100)
    }
    if (!animated || config.mode === 'single') {
      ctx.drawImage(offA, 0, 0)
      return
    }
    // ── Dual timeline ──
    // hold A  →  A→B transition  →  hold B  →  B→A transition  → (loop)
    const tr = (1 - config.holdRatio * 2) / 2
    const t1 = config.holdRatio // end of hold A
    const t2 = t1 + tr // end of A→B
    const t3 = t2 + config.holdRatio // end of hold B
    // t3 → 1.0 = B→A

    if (progress < t1) {
      ctx.drawImage(offA, 0, 0)
    } else if (progress >= t2 && progress < t3) {
      ctx.drawImage(offB, 0, 0)
    } else {
      // Composite effects on text alone, then draw over the untouched background.
      const transitionCtx = transitionCanvas.getContext('2d')!
      const forward = progress < t2
      drawTextTransition(
        transitionCtx,
        forward ? offA : offB,
        forward ? offB : offA,
        (progress - (forward ? t1 : t3)) / tr,
        config.transition,
      )
      ctx.drawImage(transitionCanvas, 0, 0)
    }
  }
}
