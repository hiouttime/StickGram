import type { Component } from 'vue'
import type { ArtworkConfigs, ArtworkType } from '@/core/artwork'
import type { Locale } from '@/core/settings'
import type { CanvasSize, DrawFrame, ExportLayout } from '@/shared/canvas/types'

export type CreationOptions = { locale?: Locale; count?: number }
export type MessageTree = { [key: string]: string | MessageTree }
export type ArtworkMessages = {
  name: string
  title: string
  description: string
  spec: string
  editor: MessageTree
}
export type ComponentLoader = () => Promise<{ default: Component }>
export interface ArtworkModule<T extends ArtworkType> {
  namespace: string
  messages: Record<Locale, ArtworkMessages>
  createConfig: (options: CreationOptions) => ArtworkConfigs[T]
  size: (config: ArtworkConfigs[T]) => CanvasSize
  duration: (config: ArtworkConfigs[T]) => number
  label: (config: ArtworkConfigs[T], animated: boolean) => string
  prepare: (config: ArtworkConfigs[T]) => Promise<DrawFrame>
  editor: ComponentLoader
  demoSize?: number
  creationDefaults?: () => CreationOptions
  creationFields?: ComponentLoader
  canCreate?: (options: CreationOptions) => boolean
  exportLayout?: (master: HTMLCanvasElement, config: ArtworkConfigs[T]) => ExportLayout
}
