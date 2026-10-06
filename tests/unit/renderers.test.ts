import assert from 'node:assert/strict'
import { beforeEach, test } from 'node:test'
import { reactive } from 'vue'
import { defaultBanner } from '../../src/core/models/banner'
import { defaultTextEmoji } from '../../src/core/models/textEmoji'
import { createTextEmojiRenderer } from '../../src/features/text-emoji/renderer'
import { createBannerRenderer, sliceBanner } from '../../src/features/banner/renderer'
import { drawTextTransition } from '../../src/features/text-emoji/transitions'
import { snapshot } from '../../src/shared/data/snapshot'

import { Canvas, canvases } from '../helpers/canvas'
beforeEach(() => {
  canvases.length = 0
})
const totalText = () => canvases.reduce((n, c) => n + c.context.text.length, 0)

test('text layers are laid out once, not reallocated for each animation frame', () => {
  const draw = createTextEmojiRenderer({ ...defaultTextEmoji(), fontWeight: 900, fontSlant: 20 })
  const target = new Canvas()
  const allocations = canvases.length,
    characters = totalText()
  for (let i = 0; i < 30; i++)
    draw(target.context as unknown as CanvasRenderingContext2D, i / 30, true)
  assert.equal(totalText(), characters)
  assert.equal(canvases.length, allocations)
  assert.equal(characters, 8)
})

test('English phrases render in full on two lines', () => {
  createTextEmojiRenderer(defaultTextEmoji('en'))
  assert.deepEqual(canvases[0].context.text, ['STAY', 'HAPPY'])
  assert.deepEqual(canvases[1].context.text, ['GOOD', 'LUCK'])
})

test('the fade transition paints at most one text per frame', () => {
  const target = new Canvas(),
    from = new Canvas(),
    to = new Canvas()
  for (const progress of [0.1, 0.3, 0.5, 0.7, 0.9]) {
    target.context.images = []
    drawTextTransition(
      target.context as unknown as CanvasRenderingContext2D,
      from as unknown as HTMLCanvasElement,
      to as unknown as HTMLCanvasElement,
      progress,
      'fade',
    )
    assert.equal(target.context.images.length, 1)
  }
})

test('banner animation reuses the cached artwork and slices adjacent source pixels', () => {
  const draw = createBannerRenderer(defaultBanner(5))
  const master = new Canvas()
  master.width = 500
  const allocations = canvases.length,
    characters = totalText()
  for (let i = 0; i < 20; i++)
    draw(master.context as unknown as CanvasRenderingContext2D, i / 20, true)
  assert.equal(totalText(), characters)
  assert.equal(canvases.length, allocations)
  const slices = Array.from({ length: 5 }, () => new Canvas())
  sliceBanner(master as unknown as HTMLCanvasElement, slices as unknown as HTMLCanvasElement[])
  slices.forEach((canvas, i) =>
    assert.deepEqual(canvas.context.images[0].slice(1), [i * 100, 0, 100, 100, 0, 0, 100, 100]),
  )
})

test('snapshots unwrap nested proxies and remain independent of ongoing edits', () => {
  const config = reactive(defaultTextEmoji())
  const copy = snapshot({ ...config, gradientColors: config.gradientColors })
  config.gradientColors[0] = '#000000'
  assert.notEqual(copy.gradientColors[0], config.gradientColors[0])
  assert.doesNotThrow(() => structuredClone(copy))
})
