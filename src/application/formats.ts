import type { ExportFormat } from '@/core/export'
import type { Locale } from '@/core/settings'
import { exportAsImage } from '@/infrastructure/export/image'
import { recordCanvases } from '@/infrastructure/export/video'

type Encoder = {
  displayName: string
  messages: Record<Locale, { name: string; description: string }>
  extension: string
  animated: boolean
  maxBytes: number
  description: string
  encode: (
    canvases: HTMLCanvasElement[],
    draw: (progress: number) => void,
    duration: number,
  ) => Promise<Blob[]>
}
export const exportFormats = {
  static: {
    displayName: 'WebP',
    messages: {
      'zh-CN': { name: '静态', description: '固定画面，支持透明背景，导出 WebP 图片' },
      en: { name: 'Static', description: 'A still WebP image with transparent background support' },
    },
    extension: 'webp',
    animated: false,
    maxBytes: 512 * 1024,
    description: 'WebP',
    encode: async (canvases) =>
      Promise.all(canvases.map((canvas) => exportAsImage(canvas, 'webp'))),
  },
  video: {
    displayName: 'WebM',
    messages: {
      'zh-CN': { name: '动态', description: '会动的文字或图片，导出最长 3 秒的视频' },
      en: {
        name: 'Animated',
        description: 'Moving text or images, exported as a video up to 3 seconds',
      },
    },
    extension: 'webm',
    animated: true,
    maxBytes: 256 * 1024,
    description: 'WebM · VP9 · ≤3s · 30fps',
    encode: recordCanvases,
  },
} satisfies Record<ExportFormat, Encoder>
export const exportFormatIds = Object.keys(exportFormats) as ExportFormat[]
export function getExportFormat(format: ExportFormat): Encoder {
  return exportFormats[format]
}
