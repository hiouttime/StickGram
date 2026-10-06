import type { CanvasSize, Renderer } from './types'
export function createCanvas({ width, height }: CanvasSize) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}
export function renderCanvas(renderer: Renderer, progress = 0, animated = false) {
  const canvas = createCanvas(renderer)
  renderer.draw(canvas.getContext('2d')!, progress, animated)
  return canvas
}
