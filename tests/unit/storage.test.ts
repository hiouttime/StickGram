import assert from 'node:assert/strict'
import { test } from 'node:test'
import { MemoryStorage } from '../helpers/storage'
import { defaultSettings } from '../../src/core/settings'
import { loadSettings, saveSettings } from '../../src/infrastructure/storage/settings'
import { clearAppStorage } from '../../src/infrastructure/storage/clear'

test('settings persistence accepts an independent storage adapter and converts only the historical format', () => {
  const storage = new MemoryStorage()
  const defaults = defaultSettings('zh-CN')
  assert.equal(loadSettings(defaults, storage).locale, 'zh-CN')
  storage.setItem('stickgram-settings', JSON.stringify({ ...defaults, defaultFormat: 'animated' }))
  assert.equal(loadSettings(defaults, storage).defaultFormat, 'video')
  saveSettings({ ...defaults, theme: 'dark', defaultFormat: 'static' }, storage)
  assert.deepEqual(loadSettings(defaultSettings('en'), storage), { ...defaults, theme: 'dark' })
})

test('clearing app data removes project and settings records while preserving unrelated origin data', () => {
  const storage = new MemoryStorage()
  for (const key of [
    'stickgram-settings',
    'stickgram-projects',
    'stickgram-project-old',
    'other-app',
  ])
    storage.setItem(key, 'value')
  clearAppStorage(storage)
  assert.equal(storage.length, 1)
  assert.equal(storage.getItem('other-app'), 'value')
})
