import type { Project } from '@/core/project'
import { renderCanvas } from '@/shared/canvas/canvas'
import { getExportFormat } from './formats'
import { exportAsImage } from '@/infrastructure/export/image'
import { exportName } from '@/infrastructure/export/filenames'
import { createZip } from '@/infrastructure/export/zip'
import { createRenderer } from './rendering'
import { createExportLayout, getArtworkModule } from './catalog'

/** Export a frozen project on independent canvases. Modules own splitting; encoders own formats. */
export async function exportProject(project: Project) {
  const renderer = await createRenderer(project),
    format = getExportFormat(project.format)
  const master = renderCanvas(renderer, 0, format.animated)
  const layout = createExportLayout(project.type, master, project.config)
  const draw = (progress: number) => {
    renderer.draw(master.getContext('2d')!, progress, format.animated)
    layout?.update()
  }
  draw(0)
  const preview = layout ? await exportAsImage(master, 'png') : undefined
  const blobs = await format.encode(
    layout?.canvases ?? [master],
    draw,
    getArtworkModule(project.type).duration(project.config),
  )
  if (blobs.some((blob) => blob.size > format.maxBytes))
    throw new Error('文件超过大小限制，请减少时长或简化效果。')
  if (!layout) return { blob: blobs[0], filename: exportName(project.name, format.extension) }
  const files = blobs.map((blob, i) => ({
    name: exportName(project.name, format.extension, i + 1),
    blob,
  }))
  files.push({ name: 'preview.png', blob: preview! })
  return { blob: await createZip(files), filename: exportName(`${project.name}_emoji`, 'zip') }
}
