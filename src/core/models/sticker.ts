export interface StickerConfig {
  image: string
  motion: 'bounce' | 'pulse' | 'none'
  scale: number
  duration: number
}

export function defaultSticker(): StickerConfig {
  return { image: '/demos/reaction-cat.png', motion: 'bounce', scale: 0.86, duration: 2000 }
}
