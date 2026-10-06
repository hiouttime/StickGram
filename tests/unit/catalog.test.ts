import assert from 'node:assert/strict'
import { test } from 'node:test'
import { artworkTypes, createArtwork, getArtworkModule } from '../../src/application/catalog'
import { transitionTypes } from '../../src/features/text-emoji/transitions'
import { exportFormatIds, getExportFormat } from '../../src/application/formats'

test('registered artwork types expose creation, editor, rendering and matching localized copy', () => {
  assert.equal(
    new Set(artworkTypes.map((type) => getArtworkModule(type).namespace)).size,
    artworkTypes.length,
  )
  for (const type of artworkTypes) {
    const module = getArtworkModule(type)
    const artwork = createArtwork(type, { locale: 'en', count: 7 })
    assert.equal(artwork.type, type)
    assert.ok(module.size(artwork.config).width > 0)
    assert.ok(module.label(artwork.config, true))
    assert.equal(typeof module.prepare, 'function')
    assert.equal(typeof module.editor, 'function')
    for (const locale of ['zh-CN', 'en'] as const) {
      assert.ok(module.messages[locale].name && module.messages[locale].title)
      assert.ok(module.messages[locale].description && module.messages[locale].spec)
    }
    assert.deepEqual(keys(module.messages.en), keys(module.messages['zh-CN']))
  }
  const banner = createArtwork('sequential-emoji', { locale: 'en', count: 7 })
  assert.equal(banner.config.count, 7)
  assert.equal(banner.config.text, 'This is a line of text')
  const emoji = createArtwork('emoji', { locale: 'en' })
  assert.equal(getArtworkModule('emoji').label(emoji.config, false), emoji.config.textA)
})

function keys(value: object, prefix = ''): string[] {
  return Object.entries(value)
    .flatMap(([key, item]) =>
      typeof item === 'string' ? [`${prefix}${key}`] : keys(item, `${prefix}${key}.`),
    )
    .sort()
}
test('every registered transition and encoder has display copy in both languages', () => {
  const messages = getArtworkModule('emoji').messages
  for (const locale of ['zh-CN', 'en'] as const) {
    const labels = messages[locale].editor.transitions as Record<string, string>
    for (const type of transitionTypes) assert.ok(labels[type], `${type} is missing ${locale} copy`)
    for (const format of exportFormatIds) {
      const encoder = getExportFormat(format)
      assert.ok(encoder.messages[locale].name && encoder.messages[locale].description)
      assert.ok(encoder.extension && encoder.maxBytes > 0)
      assert.equal(typeof encoder.encode, 'function')
    }
  }
})
