export const canvases: Canvas[] = []
export class Context {
  font = '700 38px sans-serif'
  globalAlpha = 1
  text: string[] = []
  images: unknown[][] = []
  constructor(public canvas: Canvas) {}
  clearRect() {}
  save() {}
  restore() {}
  translate() {}
  rotate() {}
  scale() {}
  transform() {}
  beginPath() {}
  closePath() {}
  roundRect() {}
  clip() {}
  fillRect() {}
  arc() {}
  fill() {}
  stroke() {}
  moveTo() {}
  lineTo() {}
  setLineDash() {}
  createLinearGradient() {
    return { addColorStop() {} }
  }
  measureText(text: string) {
    const size = Number(this.font.match(/([\d.]+)px/)![1])
    const width = [...text].length * size * 0.6
    return {
      width,
      actualBoundingBoxLeft: width / 2,
      actualBoundingBoxRight: width / 2,
      actualBoundingBoxAscent: size / 2,
      actualBoundingBoxDescent: size / 2,
    }
  }
  fillText(text: string) {
    this.text.push(text)
  }
  strokeText(text: string) {
    this.text.push(text)
  }
  drawImage(...args: unknown[]) {
    this.images.push(args)
  }
}
export class Canvas {
  width = 100
  height = 100
  context = new Context(this)
  constructor() {
    canvases.push(this)
  }
  getContext() {
    return this.context
  }
  toBlob(callback: BlobCallback, type: string) {
    callback(new Blob([JSON.stringify({ width: this.width, height: this.height })], { type }))
  }
}
Object.defineProperty(globalThis, 'document', {
  value: { createElement: () => new Canvas(), fonts: { load: async () => [] } },
})
