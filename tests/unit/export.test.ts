import assert from 'node:assert/strict'
import { test } from 'node:test'
import { unzipSync } from 'fflate'
import { createZip } from '../../src/infrastructure/export/zip'
import { exportName } from '../../src/infrastructure/export/filenames'
import { recordCanvases } from '../../src/infrastructure/export/video'
import { defaultBanner } from '../../src/core/models/banner'

const project = {
  id: 'a',
  name: '横幅',
  type: 'sequential-emoji' as const,
  config: defaultBanner(),
  format: 'static' as const,
  createdAt: 1,
  updatedAt: 1,
}

test('a numbered banner ZIP preserves binary files and its full preview', async () => {
  const files = Array.from({ length: 5 }, (_, i) => ({
    name: exportName(project.name, 'webp', i + 1),
    blob: new Blob([new Uint8Array([i, 255, 0])]),
  }))
  files.push({ name: 'preview.png', blob: new Blob([new Uint8Array([137, 80, 78, 71])]) })
  const zip = await createZip(files)
  const entries = unzipSync(new Uint8Array(await zip.arrayBuffer()))
  assert.deepEqual(Object.keys(entries), [
    '横幅_01.webp',
    '横幅_02.webp',
    '横幅_03.webp',
    '横幅_04.webp',
    '横幅_05.webp',
    'preview.png',
  ])
  assert.deepEqual([...entries['横幅_05.webp']], [4, 255, 0])
})

test('video export records all slices on a shared clock and releases their streams', async () => {
  let stoppedTracks = 0,
    nextId = 0
  const recorders: Recorder[] = []
  class Recorder {
    static isTypeSupported() {
      return true
    }
    state = 'inactive'
    ondataavailable!: (event: { data: Blob }) => void
    onstop!: () => void
    constructor() {
      recorders.push(this)
    }
    start() {
      this.state = 'recording'
      this.ondataavailable({ data: new Blob(['frame']) })
    }
    stop() {
      this.state = 'inactive'
      this.onstop()
    }
  }
  Object.defineProperty(globalThis, 'MediaRecorder', { value: Recorder })
  Object.defineProperty(globalThis, 'requestAnimationFrame', {
    value: (callback: FrameRequestCallback) => {
      const id = ++nextId
      if (id === 1) queueMicrotask(() => callback(performance.now()))
      return id
    },
  })
  Object.defineProperty(globalThis, 'cancelAnimationFrame', { value: () => {} })
  const canvas = () => ({
    width: 100,
    captureStream: () => ({ getTracks: () => [{ stop: () => stoppedTracks++ }] }),
  })
  const progress: number[] = []
  const blobs = await recordCanvases(
    Array.from({ length: 5 }, canvas) as unknown as HTMLCanvasElement[],
    (p) => {
      progress.push(p)
      if (p > 0) assert.ok(recorders.every((recorder) => recorder.state === 'recording'))
    },
    10,
  )
  assert.equal(blobs.length, 5)
  assert.ok(blobs.every((blob) => blob.size > 0 && blob.type === 'video/webm'))
  assert.equal(stoppedTracks, 5)
  assert.ok(recorders.every((recorder) => recorder.state === 'inactive'))
  assert.equal(progress[0], 0)
  assert.equal(progress.length, 2)
  assert.ok(progress[1] > 0 && progress[1] < 1)
})
