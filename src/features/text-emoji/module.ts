import { defaultTextEmoji } from '@/core/models/textEmoji'
import type { ArtworkModule } from '../types'
import { loadTextFont } from '@/shared/typography/fonts'
import { createTextEmojiRenderer } from './renderer'
import messages from './messages'

export default {
  namespace: 'textEmoji',
  messages,
  createConfig: ({ locale }) => defaultTextEmoji(locale),
  size: () => ({ width: 100, height: 100 }),
  duration: (config) => config.duration,
  label: (config, animated) =>
    animated && config.mode === 'dual' ? `${config.textA} / ${config.textB}` : config.textA,
  async prepare(config) {
    await loadTextFont(config.fontFamily, config.textA + config.textB, config.fontWeight)
    return createTextEmojiRenderer(config)
  },
  editor: () => import('./Editor.vue'),
  demoSize: 80,
} satisfies ArtworkModule<'emoji'>
