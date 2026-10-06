import { createI18n } from 'vue-i18n'
import en from './locales/en'
import zhCN from './locales/zh-CN'

import { artworkTypes, getArtworkModule } from '@/application/catalog'
import { exportFormatIds, getExportFormat } from '@/application/formats'
import type { Locale } from '@/core/settings'

function featureMessages(locale: Locale) {
  return {
    exportFormat: Object.fromEntries(
      exportFormatIds.map((format) => [format, getExportFormat(format).messages[locale]]),
    ),
    artwork: Object.fromEntries(
      artworkTypes.map((type) => {
        const { editor, ...copy } = getArtworkModule(type).messages[locale]
        return [type, copy]
      }),
    ),
    ...Object.fromEntries(
      artworkTypes.map((type) => {
        const module = getArtworkModule(type)
        return [module.namespace, module.messages[locale].editor]
      }),
    ),
  }
}

const i18n = createI18n({
  legacy: false,
  locale: navigator.language.startsWith('zh') ? 'zh-CN' : 'en',
  fallbackLocale: 'en',
  messages: {
    en: { ...en, ...featureMessages('en') },
    'zh-CN': { ...zhCN, ...featureMessages('zh-CN') },
  },
})

export default i18n
