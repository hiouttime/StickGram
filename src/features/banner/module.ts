import { defaultBanner } from '@/core/models/banner'
import type { ArtworkModule } from '../types'
import { createCanvas } from '@/shared/canvas/canvas'
import { loadTextFont } from '@/shared/typography/fonts'
import { createBannerRenderer, sliceBanner } from './renderer'
import messages from './messages'

export default {
  namespace: 'banner',
  messages,
  createConfig: ({ count, locale }) => defaultBanner(count, locale),
  size: (config) => ({ width: config.count * 100, height: 100 }),
  duration: (config) => config.duration,
  label: (config) => config.text,
  async prepare(config) {
    await loadTextFont(config.fontFamily, config.text, config.fontWeight)
    return createBannerRenderer(config)
  },
  editor: () => import('./Editor.vue'),
  creationDefaults: () => ({ count: 5 }),
  creationFields: () => import('./CreationFields.vue'),
  canCreate: (options) => !!options.count,
  exportLayout(master, config) {
    const canvases = Array.from({ length: config.count }, () =>
      createCanvas({ width: 100, height: 100 }),
    )
    return { canvases, update: () => sliceBanner(master, canvases) }
  },
} satisfies ArtworkModule<'sequential-emoji'>
