import type { ExportFormat } from '@/core/export'
import type { Settings } from '@/core/settings'
import { readJson, writeJson } from './json'
const KEY = 'stickgram-settings'
export function loadSettings(defaults: Settings, storage: Storage = localStorage): Settings {
  const stored = readJson<
    Omit<Settings, 'defaultFormat'> & { defaultFormat: ExportFormat | 'animated' }
  >(storage, KEY, defaults)
  return {
    locale: stored.locale,
    theme: stored.theme,
    defaultFormat: stored.defaultFormat === 'animated' ? 'video' : stored.defaultFormat,
  }
}
export function saveSettings(settings: Settings, storage: Storage = localStorage) {
  writeJson(storage, KEY, settings)
}
