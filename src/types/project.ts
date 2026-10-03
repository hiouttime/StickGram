export type ProjectType = 'emoji' | 'sticker' | 'sequential-emoji'
export type StickerFormat = 'static' | 'animated' | 'video'

export interface Project {
  id: string
  name: string
  type: ProjectType
  format: StickerFormat
  createdAt: number
  updatedAt: number
  thumbnail?: string
  frames: Frame[]
  width: number
  height: number
  fps: number
  duration: number
}

export interface Frame {
  id: string
  layers: Layer[]
  duration: number
  order: number
}

export interface Layer {
  id: string
  type: LayerType
  name: string
  visible: boolean
  locked: boolean
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
  scaleX: number
  scaleY: number
  data: Record<string, any>
}

export type LayerType = 'image' | 'text' | 'shape' | 'lottie'

export interface ProjectMeta {
  id: string
  name: string
  type: ProjectType
  format: StickerFormat
  createdAt: number
  updatedAt: number
  thumbnail?: string
}
