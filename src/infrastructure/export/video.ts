/** Record every canvas with one animation clock so banner slices stay synchronized. */
export async function recordCanvases(
  canvases: HTMLCanvasElement[],
  draw: (progress: number) => void,
  duration: number,
): Promise<Blob[]> {
  const mime = 'video/webm;codecs=vp9'
  if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported(mime))
    throw new Error('当前浏览器不支持 VP9 WebM 导出，请使用支持 VP9 录制的浏览器。')
  const streams: MediaStream[] = []
  const recorders: MediaRecorder[] = []
  let raf = 0,
    timer: ReturnType<typeof setTimeout> | undefined
  try {
    draw(0)
    const finished = canvases.map((canvas) => {
      const stream = canvas.captureStream(30)
      streams.push(stream)
      const recorder = new MediaRecorder(stream, {
        mimeType: mime,
        videoBitsPerSecond: canvas.width > 100 ? 500000 : 300000,
      })
      recorders.push(recorder)
      return new Promise<Blob>((resolve, reject) => {
        const chunks: Blob[] = []
        recorder.ondataavailable = (event) => {
          if (event.data.size) chunks.push(event.data)
        }
        recorder.onerror = () => reject(new Error('视频录制失败'))
        recorder.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' }))
      })
    })
    const result = Promise.all(finished)
    const start = performance.now()
    const tick = (ts: number) => {
      draw(Math.min((ts - start) / duration, 0.9999))
      raf = requestAnimationFrame(tick)
    }
    recorders.forEach((recorder) => recorder.start())
    raf = requestAnimationFrame(tick)
    timer = setTimeout(() => {
      cancelAnimationFrame(raf)
      recorders.forEach((recorder) => {
        if (recorder.state !== 'inactive') recorder.stop()
      })
    }, duration)
    return await result
  } finally {
    cancelAnimationFrame(raf)
    if (timer) clearTimeout(timer)
    recorders.forEach((recorder) => {
      if (recorder.state !== 'inactive') recorder.stop()
    })
    streams.forEach((stream) => stream.getTracks().forEach((track) => track.stop()))
  }
}
