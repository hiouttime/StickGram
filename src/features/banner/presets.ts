import type { BannerConfig } from '@/core/models/banner'
import { defaultBanner } from '@/core/models/banner'

function template(id: string, overrides: Partial<BannerConfig>) {
  return { id, label: `banner.styles.${id}`, config: { ...defaultBanner(), ...overrides } }
}

export const bannerTemplates = [
  template('berry', {}),
  template('neon', {
    count: 6,
    text: '灵感正在发光',
    colors: ['#15132E', '#302050'],
    textColor: '#8DF9F2',
    fontFamily: '"ZCOOL QingKe HuangYou"',
    shadow: false,
    sparkles: false,
    outline: true,
    glow: true,
    border: 'solid',
  }),
  template('cream', {
    count: 6,
    text: '慢慢来也很好',
    colors: ['#FFF3D4', '#FFE4BD'],
    textColor: '#98482D',
    fontFamily: '"LXGW WenKai"',
    shadow: false,
    sparkles: false,
    border: 'dashed',
  }),
  template('arcade', {
    count: 6,
    text: '准备好就出发',
    colors: ['#292147', '#17192C'],
    textColor: '#B6FA70',
    fontFamily: '"ZCOOL QingKe HuangYou"',
    shadow: false,
    sparkles: false,
    rounded: false,
    pattern: 'grid',
    outline: true,
  }),
  template('mint', {
    count: 6,
    text: '把美好装进口袋',
    colors: ['#D9F3DC', '#AFE4D2'],
    textColor: '#246654',
    fontFamily: '"LXGW WenKai"',
    shadow: false,
    sparkles: false,
    border: 'double',
  }),
  template('sunset', {
    count: 8,
    text: '保持热爱奔赴山海',
    colors: ['#FFAF62', '#E65777', '#8A3F8E'],
    textColor: '#FFF9EF',
    fontFamily: '"Noto Serif SC Variable"',
    sparkles: false,
    pattern: 'diagonal',
  }),
  template('gold', {
    count: 7,
    text: '闪闪发光的日子',
    colors: ['#292727', '#0F1117'],
    textColor: '#F5D58A',
    fontFamily: '"Noto Serif SC Variable"',
    shadow: false,
    border: 'double',
  }),
  template('candy', {
    count: 5,
    text: '快乐不打烊',
    colors: ['#FFB2D2', '#C4B6F7', '#A4DFF4'],
    textColor: '#623D88',
    fontFamily: '"ZCOOL KuaiLe"',
    shadow: false,
    sparkles: false,
    pattern: 'dots',
  }),
  template('minimal', {
    count: 4,
    text: '状态在线',
    colors: ['#F2F6FF', '#DFE8F9'],
    textColor: '#2446A2',
    shadow: false,
    sparkles: false,
    rounded: false,
    border: 'solid',
  }),
]

export function getBannerTemplate(id: string) {
  return bannerTemplates.find((preset) => preset.id === id)!
}

const styleKeys = [
  'colors',
  'textColor',
  'fontFamily',
  'rounded',
  'shadow',
  'sparkles',
  'pattern',
  'border',
  'outline',
  'glow',
] as const
export function matchingBannerTemplate(config: BannerConfig) {
  return bannerTemplates.find((preset) =>
    styleKeys.every((key) => JSON.stringify(config[key]) === JSON.stringify(preset.config[key])),
  )?.id
}
