import type { Project } from '@/core/project'
import { normalizeProject } from './migrations'
import type { LegacyProject } from './migrations'
import { readJson, writeJson } from './json'

const KEY = 'stickgram-projects'
export type ProjectCollection = Record<string, Project>
export function loadProjects(storage: Storage = localStorage): ProjectCollection {
  const stored = readJson<Record<string, Project | LegacyProject>>(storage, KEY, {})
  const projects = Object.fromEntries(
    Object.entries(stored).map(([id, project]) => {
      const legacyKey = `stickgram-project-${id}`
      const normalized = normalizeProject(readJson(storage, legacyKey, project))
      storage.removeItem(legacyKey)
      return [id, normalized]
    }),
  )
  saveProjects(projects, storage)
  return projects
}
export function saveProjects(projects: ProjectCollection, storage: Storage = localStorage) {
  writeJson(storage, KEY, projects)
}
