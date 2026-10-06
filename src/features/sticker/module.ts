import { defaultSticker } from '@/core/models/sticker'
import type { ArtworkModule } from '../types'
import { createStickerRenderer, loadStickerImage } from './renderer'
import messages from './messages'

export default {
  namespace: 'sticker',
  messages,
  createConfig: () => defaultSticker(),
  size: () => ({ width: 512, height: 512 }),
  duration: (config) => config.duration,
  label: () => '贴纸预览',
  async prepare(config) {
    return createStickerRenderer(await loadStickerImage(config.image), config)
  },
  editor: () => import('./Editor.vue'),
  demoSize: 150,
} satisfies ArtworkModule<'sticker'>
