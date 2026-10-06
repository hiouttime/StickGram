export type CanvasSize = { width: number; height: number }
export type DrawFrame = (ctx: CanvasRenderingContext2D, progress: number, animated: boolean) => void
export type Renderer = CanvasSize & { draw: DrawFrame }
export type PreviewSource = CanvasSize & {
  label: string
  duration: number
  prepare: () => Promise<Renderer>
}
export type ExportLayout = { canvases: HTMLCanvasElement[]; update: () => void }
