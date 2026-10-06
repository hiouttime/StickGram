import { computed, reactive, ref, watch } from 'vue'
import type { Artwork } from '@/core/artwork'
import { getExportFormat } from './formats'
import type { Project } from '@/core/project'
import { useProjectsStore } from './projects'
import { snapshot } from '@/shared/data/snapshot'
import { exportProject } from './exportProject'
import { useFileDownload } from '@/shared/browser/useFileDownload'

export function useProjectEditor<T extends Project>(project: T) {
  const store = useProjectsStore()
  const config = reactive(snapshot(project.config)) as T['config']
  const { downloadUrl, downloadName, downloadFile, clearDownload } = useFileDownload()
  const exporting = ref(false),
    error = ref(''),
    thumbnail = ref('')
  const playing = getExportFormat(project.format).animated
  const artwork = computed(() => ({ type: project.type, config }) as Artwork)

  watch(
    config,
    () => {
      clearDownload()
      error.value = ''
      store.updateConfig(project.id, snapshot(config))
    },
    { deep: true },
  )

  function setThumbnail(canvas: HTMLCanvasElement) {
    thumbnail.value = canvas.toDataURL('image/webp', 0.85)
    store.setThumbnail(project.id, thumbnail.value)
  }

  async function exportArtwork() {
    exporting.value = true
    error.value = ''
    const projectSnapshot = snapshot({ ...project, config }) as Project
    try {
      const { blob, filename } = await exportProject(projectSnapshot)
      downloadFile(blob, filename)
    } catch (cause) {
      error.value = (cause as Error).message
    } finally {
      exporting.value = false
    }
  }

  return {
    config,
    artwork,
    playing,
    thumbnail,
    setThumbnail,
    exporting,
    error,
    downloadUrl,
    downloadName,
    exportArtwork,
  }
}
