import type { Artwork, ArtworkType } from './artwork'
import type { ExportFormat } from './export'

export type ProjectMeta = {
  id: string
  name: string
  format: ExportFormat
  createdAt: number
  updatedAt: number
  thumbnail?: string
}
export type Project = ProjectMeta & Artwork
export type ProjectOf<T extends ArtworkType> = Extract<Project, { type: T }>

export function searchProjects(projects: Project[], query: string) {
  const term = query.trim().toLocaleLowerCase()
  return projects.filter((project) => project.name.toLocaleLowerCase().includes(term))
}
