import assert from 'node:assert/strict'
import { test } from 'node:test'
import { unzipSync } from 'fflate'
import '../helpers/canvas'
import { createArtwork, artworkModules } from '../../src/application/catalog'
import { exportProject } from '../../src/application/exportProject'
import { createCanvas } from '../../src/shared/canvas/canvas'

const meta = { id: 'example', name: '测试', format: 'static' as const, createdAt: 1, updatedAt: 1 }

test('the export coordinator renders a registered single artwork using its selected encoder', async () => {
  const result = await exportProject({ ...meta, ...createArtwork('emoji') })
  assert.equal(result.filename, '测试.webp')
  assert.equal(result.blob.type, 'image/webp')
  assert.deepEqual(JSON.parse(await result.blob.text()), { width: 100, height: 100 })
})

test('the banner module supplies slicing while the export coordinator packages the pieces and full preview', async () => {
  const artwork = createArtwork('sequential-emoji', { count: 7 })
  const result = await exportProject({ ...meta, ...artwork })
  assert.equal(result.filename, '测试_emoji.zip')
  const files = unzipSync(new Uint8Array(await result.blob.arrayBuffer()))
  assert.equal(Object.keys(files).length, 8)
  const decode = (name: string) => JSON.parse(new TextDecoder().decode(files[name]))
  assert.deepEqual(decode('测试_07.webp'), { width: 100, height: 100 })
  assert.deepEqual(decode('preview.png'), { width: 700, height: 100 })
})

test('a module can add a multi-file layout without changing the export coordinator', async () => {
  const original = artworkModules.emoji
  artworkModules.emoji = {
    ...original,
    exportLayout(master) {
      const canvases = [
        createCanvas({ width: 50, height: 100 }),
        createCanvas({ width: 50, height: 100 }),
      ]
      return {
        canvases,
        update: () =>
          canvases.forEach((canvas, index) =>
            canvas.getContext('2d')!.drawImage(master, index * 50, 0, 50, 100, 0, 0, 50, 100),
          ),
      }
    },
  }
  try {
    const result = await exportProject({ ...meta, ...createArtwork('emoji') })
    const entries = unzipSync(new Uint8Array(await result.blob.arrayBuffer()))
    assert.deepEqual(Object.keys(entries), ['测试_01.webp', '测试_02.webp', 'preview.png'])
    assert.deepEqual(JSON.parse(new TextDecoder().decode(entries['测试_02.webp'])), {
      width: 50,
      height: 100,
    })
  } finally {
    artworkModules.emoji = original
  }
})
