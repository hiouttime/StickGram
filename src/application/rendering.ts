import type { Artwork } from '@/core/artwork'
import type { Renderer } from '@/shared/canvas/types'
import { getArtworkModule } from './catalog'

export async function createRenderer(artwork: Artwork): Promise<Renderer> {
  const module = getArtworkModule(artwork.type)
  return { ...module.size(artwork.config), draw: await module.prepare(artwork.config) }
}
