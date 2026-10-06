import type { TextEmojiConfig } from './models/textEmoji'
import type { BannerConfig } from './models/banner'
import type { StickerConfig } from './models/sticker'

export interface ArtworkConfigs {
  emoji: TextEmojiConfig
  sticker: StickerConfig
  'sequential-emoji': BannerConfig
}
export type ArtworkType = keyof ArtworkConfigs
export type Artwork<T extends ArtworkType = ArtworkType> = {
  [K in T]: { type: K; config: ArtworkConfigs[K] }
}[T]
export type ProjectConfig = ArtworkConfigs[ArtworkType]
