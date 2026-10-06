import assert from 'node:assert/strict'
import { beforeEach, test } from 'node:test'
import { createPinia, setActivePinia } from 'pinia'
import { defaultBanner } from '../../src/core/models/banner'
import { defaultTextEmoji } from '../../src/core/models/textEmoji'
import { normalizeProject } from '../../src/infrastructure/storage/migrations'
import type { LegacyProject } from '../../src/infrastructure/storage/migrations'
import { useProjectsStore } from '../../src/application/projects'

import { MemoryStorage } from '../helpers/storage'
const storage = new MemoryStorage()
Object.defineProperty(globalThis, 'localStorage', { value: storage })
Object.defineProperty(globalThis, 'window', {
  value: {
    matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  },
})

beforeEach(() => {
  storage.data.clear()
  setActivePinia(createPinia())
})

const legacy = (id: string, time: number): LegacyProject => ({
  id,
  name: id,
  type: 'emoji',
  format: 'video',
  createdAt: time,
  updatedAt: time,
  textEmoji: defaultTextEmoji(),
})

test('legacy configuration conversion preserves the artwork and timestamps', () => {
  const project = normalizeProject({
    ...legacy('a', 10),
    format: 'animated',
    textEmoji: { ...defaultTextEmoji(), textA: '自己文字', fontWeight: 900, fontSlant: 12 },
  })
  assert.equal(project.format, 'video')
  assert.equal(project.updatedAt, 10)
  assert.equal(project.type, 'emoji')
  if (project.type === 'emoji') {
    assert.equal(project.config.textA, '自己文字')
    assert.equal(project.config.fontSlant, 12)
    assert.equal(project.config.fontWeight, 900)
  }
  assert.ok(!('frames' in project) && !('textEmoji' in project))
})

test('the old detail record is consolidated into one source of truth', () => {
  storage.setItem('stickgram-projects', JSON.stringify({ a: legacy('a', 10) }))
  storage.setItem('stickgram-project-a', JSON.stringify({ ...legacy('a', 20), name: '最新名称' }))
  const store = useProjectsStore()
  assert.equal(store.projects.a.name, '最新名称')
  assert.equal(store.projects.a.updatedAt, 20)
  assert.equal(storage.getItem('stickgram-project-a'), null)
  assert.equal(JSON.parse(storage.getItem('stickgram-projects')!).a.config.textA, '天天开心')
})

test('thumbnail refreshes preserve order, while edits update order and persist', () => {
  storage.setItem('stickgram-projects', JSON.stringify({ a: legacy('a', 10), b: legacy('b', 20) }))
  const store = useProjectsStore()
  store.setThumbnail('a', 'data:image/webp;base64,preview')
  assert.deepEqual(
    store.projectList.map((p) => p.id),
    ['b', 'a'],
  )
  assert.equal(store.projects.a.updatedAt, 10)
  store.updateConfig('a', { ...defaultTextEmoji(), textA: '新文字' })
  assert.deepEqual(
    store.projectList.map((p) => p.id),
    ['a', 'b'],
  )
  assert.equal(JSON.parse(storage.getItem('stickgram-projects')!).a.config.textA, '新文字')
})

test('duplicating a project gives independent nested settings', () => {
  const store = useProjectsStore()
  const id = store.createProject({
    name: '横幅',
    format: 'static',
    artwork: { type: 'sequential-emoji', config: defaultBanner(7) },
  })
  const copyId = store.duplicateProject(id)
  const original = store.projects[id],
    copy = store.projects[copyId]
  assert.equal(copy.type, 'sequential-emoji')
  assert.notEqual(copyId, id)
  if (original.type === 'sequential-emoji' && copy.type === 'sequential-emoji') {
    copy.config.colors[0] = '#000000'
    assert.notEqual(copy.config.colors[0], original.config.colors[0])
    assert.equal(original.config.count, 7)
  }
  store.deleteProject(copyId)
  assert.equal(store.projectCount, 1)
})

test('localized defaults contain the full requested phrases', () => {
  assert.equal(defaultTextEmoji('en').textA, 'STAY HAPPY')
  assert.equal(defaultTextEmoji('en').textB, 'GOOD LUCK')
  assert.equal(defaultTextEmoji().textA, '天天开心')
  assert.equal(defaultBanner(5).text, '这是一段文字')
  assert.equal(defaultBanner(5, 'en').text, 'This is a line of text')
})
