export function exportAsImage(
  canvas: HTMLCanvasElement,
  format: 'png' | 'webp',
  quality = 1,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('无法生成图片'))),
      `image/${format}`,
      quality,
    )
  })
}
