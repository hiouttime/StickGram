import type { StickerConfig } from '@/core/models/sticker'
import type { DrawFrame } from '@/shared/canvas/types'
export function loadStickerImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('无法加载贴纸图片'))
    image.src = source
  })
}
export function createStickerRenderer(image: HTMLImageElement, config: StickerConfig): DrawFrame {
  return (ctx, progress, animated) => {
    const { width, height } = ctx.canvas
    ctx.clearRect(0, 0, width, height)
    const wave = Math.sin(progress * Math.PI * 2)
    const scale = config.scale * (animated && config.motion === 'pulse' ? 1 + 0.08 * wave : 1)
    const ratio = Math.min(width / image.width, height / image.height) * scale
    ctx.save()
    ctx.translate(width / 2, height / 2)
    if (animated && config.motion === 'bounce') {
      ctx.translate(0, -height * 0.025 * (1 - Math.cos(progress * Math.PI * 2)))
      ctx.rotate(wave * 0.05)
    }
    ctx.drawImage(
      image,
      (-image.width * ratio) / 2,
      (-image.height * ratio) / 2,
      image.width * ratio,
      image.height * ratio,
    )
    ctx.restore()
  }
}
