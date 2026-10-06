import type { Artwork, ArtworkConfigs, ArtworkType } from '@/core/artwork'
import type { ArtworkModule, CreationOptions } from '@/features/types'
import textEmoji from '@/features/text-emoji/module'
import sticker from '@/features/sticker/module'
import banner from '@/features/banner/module'

export const artworkModules: { [K in ArtworkType]: ArtworkModule<K> } = {
  emoji: textEmoji,
  sticker,
  'sequential-emoji': banner,
}
export const artworkTypes = Object.keys(artworkModules) as ArtworkType[]

// Keep the type/config correlation at this single dispatch boundary.
export function getArtworkModule<T extends ArtworkType>(type: T): ArtworkModule<T> {
  return artworkModules[type]
}
export function createArtwork<T extends ArtworkType>(
  type: T,
  options: CreationOptions = {},
): Artwork<T> {
  return { type, config: getArtworkModule(type).createConfig(options) } as Artwork<T>
}
export function artworkSize(artwork: Artwork) {
  return getArtworkModule(artwork.type).size(artwork.config)
}
export function createExportLayout(
  type: ArtworkType,
  canvas: HTMLCanvasElement,
  config: ArtworkConfigs[ArtworkType],
) {
  return getArtworkModule(type).exportLayout?.(canvas, config)
}
