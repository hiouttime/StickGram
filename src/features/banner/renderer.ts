import type { BannerConfig } from '@/core/models/banner'
import { textFont, applyTextSlant, textSlantShear } from '@/shared/typography/fonts'
import type { DrawFrame } from '@/shared/canvas/types'
import { drawGleamTransition } from '@/shared/canvas/gleam'

/** The full banner is rendered once; every emoji is an exact adjacent crop. */
export function createBannerRenderer(config: BannerConfig): DrawFrame {
  const width = config.count * 100
  const height = 100
  const background = document.createElement('canvas')
  background.width = width
  background.height = height
  const ctx = background.getContext('2d')!
  ctx.save()
  ctx.beginPath()
  ctx.roundRect(0, 0, width, height, config.rounded ? 16 : 0)
  ctx.clip()
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  config.colors.forEach((color, i) => gradient.addColorStop(i / (config.colors.length - 1), color))
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  ctx.save()
  ctx.fillStyle = ctx.strokeStyle = config.textColor
  ctx.globalAlpha = 0.12
  if (config.pattern === 'dots') {
    for (let x = 12; x < width; x += 26)
      for (let y = 12; y < height; y += 26) {
        ctx.beginPath()
        ctx.arc(x + (Math.floor(y / 26) % 2) * 13, y, 3, 0, Math.PI * 2)
        ctx.fill()
      }
  } else if (config.pattern === 'grid') {
    ctx.lineWidth = 1
    ctx.beginPath()
    for (let x = 0; x < width; x += 20) {
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
    }
    for (let y = 0; y < height; y += 20) {
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
    }
    ctx.stroke()
  } else if (config.pattern === 'diagonal') {
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 12
    ctx.beginPath()
    for (let x = -height; x < width; x += 58) {
      ctx.moveTo(x, 0)
      ctx.lineTo(x + height, height)
    }
    ctx.stroke()
  }
  ctx.restore()
  if (config.sparkles) {
    ctx.fillStyle = '#FFD780'
    for (let i = 0; i < config.count * 4; i++) {
      const x = (i * 83 + 23) % width
      const y = (i * 31 + 13) % height
      ctx.globalAlpha = 0.3 + (i % 3) * 0.16
      ctx.beginPath()
      ctx.arc(x, y, i % 3 === 0 ? 2 : 1, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }
  if (config.border !== 'none') {
    ctx.save()
    ctx.strokeStyle = config.textColor
    ctx.globalAlpha = 0.6
    ctx.lineWidth = 1.5
    if (config.border === 'dashed') ctx.setLineDash([6, 5])
    ctx.beginPath()
    ctx.roundRect(5, 5, width - 10, height - 10, config.rounded ? 12 : 0)
    ctx.stroke()
    if (config.border === 'double') {
      ctx.beginPath()
      ctx.roundRect(9, 9, width - 18, height - 18, config.rounded ? 8 : 0)
      ctx.stroke()
    }
    ctx.restore()
  }
  const textLayer = document.createElement('canvas')
  textLayer.width = width
  textLayer.height = height
  const textCtx = textLayer.getContext('2d')!
  let size = 72
  textCtx.font = textFont(config.fontFamily, size, config.fontWeight)
  const measured =
    textCtx.measureText(config.text).width + Math.abs(textSlantShear(config.fontSlant)) * size
  if (measured > width - 36) size *= (width - 36) / measured
  textCtx.font = textFont(config.fontFamily, size, config.fontWeight)
  textCtx.textAlign = 'center'
  textCtx.textBaseline = 'middle'
  applyTextSlant(textCtx, config.fontSlant, 52)
  if (config.shadow) {
    textCtx.fillStyle = 'rgba(45,10,58,0.16)'
    for (let offset = 20; offset >= 1; offset--)
      textCtx.fillText(config.text, width / 2 + offset, 52 + offset)
  }
  textCtx.fillStyle = config.textColor
  if (config.glow) {
    textCtx.shadowColor = config.textColor
    textCtx.shadowBlur = 9
  }
  if (config.outline) {
    textCtx.strokeStyle = config.textColor
    textCtx.lineWidth = Math.max(1.5, size * 0.035)
    textCtx.lineJoin = 'round'
    textCtx.strokeText(config.text, width / 2, 52)
  } else textCtx.fillText(config.text, width / 2, 52)
  ctx.restore()
  const shine = document.createElement('canvas')
  shine.width = width
  shine.height = height
  return (ctx, progress, animated) => {
    ctx.clearRect(0, 0, width, height)
    ctx.save()
    ctx.beginPath()
    ctx.roundRect(0, 0, width, height, config.rounded ? 16 : 0)
    ctx.clip()
    ctx.drawImage(background, 0, 0)
    if (animated) {
      drawGleamTransition(shine.getContext('2d')!, textLayer, textLayer, progress, 'h')
      ctx.drawImage(shine, 0, 0)
    } else ctx.drawImage(textLayer, 0, 0)
    ctx.restore()
  }
}

export function sliceBanner(source: HTMLCanvasElement, slices: HTMLCanvasElement[]) {
  slices.forEach((slice, index) => {
    const ctx = slice.getContext('2d')!
    ctx.clearRect(0, 0, 100, 100)
    ctx.drawImage(source, index * 100, 0, 100, 100, 0, 0, 100, 100)
  })
}
