import type { ExportFormat } from './export'
export type Locale = 'zh-CN' | 'en'
export type Theme = 'light' | 'dark' | 'auto'
export interface Settings {
  locale: Locale
  theme: Theme
  defaultFormat: ExportFormat
}
export function defaultSettings(language: string): Settings {
  return {
    locale: language.startsWith('zh') ? 'zh-CN' : 'en',
    theme: 'auto',
    defaultFormat: 'static',
  }
}
