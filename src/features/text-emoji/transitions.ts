import type { TransitionType } from '@/core/models/textEmoji'
import { drawGleamTransition } from '@/shared/canvas/gleam'

type TransitionDraw = (
  ctx: CanvasRenderingContext2D,
  from: HTMLCanvasElement,
  to: HTMLCanvasElement,
  progress: number,
) => void
function ease(progress: number) {
  return progress * progress * (3 - 2 * progress)
}
function slide(horizontal: boolean): TransitionDraw {
  return (ctx, from, to, progress) => {
    const { width, height } = ctx.canvas,
      t = ease(progress)
    ctx.drawImage(from, horizontal ? -width * t : 0, horizontal ? 0 : -height * t)
    ctx.drawImage(to, horizontal ? width * (1 - t) : 0, horizontal ? 0 : height * (1 - t))
  }
}
function reveal(
  shape: (width: number, height: number, progress: number) => Path2D,
): TransitionDraw {
  return (ctx, from, to, progress) => {
    const { width, height } = ctx.canvas,
      path = shape(width, height, ease(progress))
    const remaining = new Path2D()
    remaining.rect(0, 0, width, height)
    remaining.addPath(path)
    ctx.save()
    ctx.clip(remaining, 'evenodd')
    ctx.drawImage(from, 0, 0)
    ctx.restore()
    ctx.clip(path)
    ctx.drawImage(to, 0, 0)
  }
}
// These effects finish hiding one phrase before showing the next.
function transform(
  change?: (
    ctx: CanvasRenderingContext2D,
    visibility: number,
    outgoing: boolean,
    progress: number,
  ) => void,
): TransitionDraw {
  return (ctx, from, to, progress) => {
    const outgoing = progress < 0.5
    const visibility = outgoing ? 1 - ease(progress * 2) : ease((progress - 0.5) * 2)
    ctx.globalAlpha = visibility
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2)
    change?.(ctx, visibility, outgoing, progress)
    ctx.drawImage(outgoing ? from : to, -ctx.canvas.width / 2, -ctx.canvas.height / 2)
  }
}

export const transitionEffects: Record<TransitionType, TransitionDraw> = {
  'gleam-h': (ctx, from, to, progress) => drawGleamTransition(ctx, from, to, progress, 'h'),
  'gleam-d': (ctx, from, to, progress) => drawGleamTransition(ctx, from, to, progress, 'd'),
  fade: transform(),
  zoom: transform((ctx, visibility) => {
    const scale = 0.6 + visibility * 0.4
    ctx.scale(scale, scale)
  }),
  'slide-left': slide(true),
  'slide-up': slide(false),
  flip: transform((ctx, _, __, progress) => {
    ctx.globalAlpha = 1
    ctx.scale(Math.abs(Math.cos(Math.PI * progress)), 1)
  }),
  spin: transform((ctx, visibility, outgoing) => {
    ctx.rotate(((outgoing ? 1 : -1) * (1 - visibility) * Math.PI) / 2)
    const scale = 0.5 + visibility * 0.5
    ctx.scale(scale, scale)
  }),
  iris: reveal((width, height, progress) => {
    const path = new Path2D()
    path.arc(width / 2, height / 2, (Math.hypot(width, height) / 2) * progress, 0, Math.PI * 2)
    return path
  }),
  blinds: reveal((width, height, progress) => {
    const path = new Path2D(),
      strips = 6,
      stripWidth = width / strips
    for (let i = 0; i < strips; i++)
      path.rect(
        i * stripWidth + (stripWidth * (1 - progress)) / 2,
        0,
        stripWidth * progress,
        height,
      )
    return path
  }),
  cut: (ctx, from, to, progress) => ctx.drawImage(progress < 0.5 ? from : to, 0, 0),
}
export const transitionTypes = Object.keys(transitionEffects) as TransitionType[]

/** Effects draw only onto the transparent text layer. */
export function drawTextTransition(
  ctx: CanvasRenderingContext2D,
  from: HTMLCanvasElement,
  to: HTMLCanvasElement,
  progress: number,
  type: TransitionType,
) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  if (progress === 0 || progress === 1) {
    ctx.drawImage(progress === 0 ? from : to, 0, 0)
    return
  }
  ctx.save()
  transitionEffects[type](ctx, from, to, progress)
  ctx.restore()
}
