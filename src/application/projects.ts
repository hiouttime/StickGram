import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'
import type { Artwork, ProjectConfig } from '@/core/artwork'
import type { Project } from '@/core/project'
import type { ExportFormat } from '@/core/export'
import { loadProjects, saveProjects } from '@/infrastructure/storage/projects'
import { snapshot } from '@/shared/data/snapshot'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref(loadProjects())
  const projectList = computed(() =>
    Object.values(projects.value).sort((a, b) => b.updatedAt - a.updatedAt),
  )
  const projectCount = computed(() => projectList.value.length)
  watch(projects, (value) => saveProjects(value), { deep: true, flush: 'sync' })

  function createProject(options: { name: string; format: ExportFormat; artwork: Artwork }) {
    const id = nanoid(),
      now = Date.now()
    projects.value[id] = {
      id,
      name: options.name,
      format: options.format,
      createdAt: now,
      updatedAt: now,
      ...options.artwork,
    }
    return id
  }
  function deleteProject(id: string) {
    delete projects.value[id]
  }
  function updateConfig(id: string, config: ProjectConfig) {
    projects.value[id] = { ...projects.value[id], config, updatedAt: Date.now() } as Project
  }
  function setThumbnail(id: string, thumbnail: string) {
    projects.value[id].thumbnail = thumbnail
  }
  function duplicateProject(id: string) {
    const project = snapshot(projects.value[id]),
      idOfCopy = nanoid(),
      now = Date.now()
    projects.value[idOfCopy] = {
      ...project,
      id: idOfCopy,
      name: `${project.name} (Copy)`,
      createdAt: now,
      updatedAt: now,
    }
    return idOfCopy
  }
  return {
    projects,
    projectList,
    projectCount,
    createProject,
    deleteProject,
    updateConfig,
    setThumbnail,
    duplicateProject,
  }
})
