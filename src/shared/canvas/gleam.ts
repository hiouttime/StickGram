/** Draw a sweeping highlight on a transparent text layer, preserving its alpha. */
export function drawGleamTransition(
  ctx: CanvasRenderingContext2D,
  from: HTMLCanvasElement,
  to: HTMLCanvasElement,
  progress: number,
  angle: 'h' | 'd',
) {
  const { width, height } = ctx.canvas
  const slope = angle === 'd' ? 0.8 : 0
  const halfWidth = width * (angle === 'd' ? 0.24 : 0.18)
  const normalLength = Math.hypot(1, slope)
  // Start and finish outside every corner, including the full highlight band.
  const margin = (slope * height) / 2 + halfWidth * normalLength
  const edge = -margin + progress * (width + 2 * margin)

  ctx.clearRect(0, 0, width, height)
  ctx.drawImage(from, 0, 0)

  ctx.save()
  ctx.beginPath()
  ctx.moveTo(edge - (slope * height) / 2, 0)
  ctx.lineTo(edge + (slope * height) / 2, height)
  ctx.lineTo(0, height)
  ctx.lineTo(0, 0)
  ctx.closePath()
  ctx.clip()
  // Replace the swept region so old glyphs do not show through new text gaps.
  ctx.clearRect(0, 0, width, height)
  ctx.drawImage(to, 0, 0)
  ctx.restore()

  const dx = halfWidth / normalLength
  const dy = -slope * dx
  const gleam = ctx.createLinearGradient(edge - dx, height / 2 - dy, edge + dx, height / 2 + dy)
  gleam.addColorStop(0, 'rgba(255,255,255,0)')
  gleam.addColorStop(0.3, 'rgba(255,255,255,0.55)')
  gleam.addColorStop(0.5, 'rgba(255,255,255,0.88)')
  gleam.addColorStop(0.7, 'rgba(255,255,255,0.55)')
  gleam.addColorStop(1, 'rgba(255,255,255,0)')

  ctx.save()
  ctx.globalCompositeOperation = 'source-atop'
  ctx.fillStyle = gleam
  ctx.fillRect(0, 0, width, height)
  ctx.restore()
}
