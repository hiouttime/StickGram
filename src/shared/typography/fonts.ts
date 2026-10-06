export const fontOptions = [
  { label: '系统默认', value: 'sans-serif', description: '系统无衬线', weight: 700 },
  { label: '系统衬线', value: 'serif', description: '系统宋体风格', weight: 700 },
  { label: '系统等宽', value: 'monospace', description: '系统等宽字体', weight: 700 },
  {
    label: '思源黑体',
    value: '"Noto Sans SC Variable"',
    description: '清晰厚实',
    weight: 700,
    license: 'noto-sans-sc',
  },
  {
    label: '思源宋体',
    value: '"Noto Serif SC Variable"',
    description: '经典宋体',
    weight: 700,
    license: 'noto-serif-sc',
  },
  {
    label: '霞鹜文楷',
    value: '"LXGW WenKai"',
    description: '温润手写',
    weight: 700,
    license: 'lxgw-wenkai',
  },
  {
    label: '站酷快乐体',
    value: '"ZCOOL KuaiLe"',
    description: '活泼俏皮',
    weight: 400,
    license: 'zcool-kuaile',
  },
  {
    label: '站酷庆科黄油体',
    value: '"ZCOOL QingKe HuangYou"',
    description: '圆润醒目',
    weight: 400,
    license: 'zcool-qingke-huangyou',
  },
  {
    label: '马善政毛笔体',
    value: '"Ma Shan Zheng"',
    description: '毛笔书法',
    weight: 400,
    license: 'ma-shan-zheng',
  },
]

export function resolveFontWeight(family: string, weight?: number) {
  return weight ?? fontOptions.find((font) => font.value === family)!.weight
}

export function textFont(family: string, size: number, weight?: number) {
  return `${resolveFontWeight(family, weight)} ${size}px ${family}`
}

/** Positive angles lean right, consistently for bundled and system fonts. */
export function textSlantShear(angle = 0) {
  return -Math.tan((angle * Math.PI) / 180)
}

export function applyTextSlant(
  ctx: CanvasRenderingContext2D,
  angle: number | undefined,
  centerY: number,
) {
  const shear = textSlantShear(angle)
  ctx.transform(1, 0, shear, 1, -shear * centerY, 0)
}

const pendingFonts = new Map<string, Promise<FontFace[]>>()

export function loadTextFont(family: string, text: string, weight?: number): Promise<FontFace[]> {
  if (!fontOptions.find((font) => font.value === family)?.license) return Promise.resolve([])
  const key = `${textFont(family, 38, weight)}:${text}`
  let pending = pendingFonts.get(key)
  if (!pending) {
    pending = document.fonts.load(textFont(family, 38, weight), text).catch((error) => {
      pendingFonts.delete(key)
      throw error
    })
    pendingFonts.set(key, pending)
  }
  return pending
}
