import type { TextStyle } from '../typography'

export const bannerPatterns = ['none', 'dots', 'grid', 'diagonal'] as const
export const bannerBorders = ['none', 'solid', 'double', 'dashed'] as const

export interface BannerConfig extends TextStyle {
  count: number
  text: string
  colors: string[]
  textColor: string
  rounded: boolean
  shadow: boolean
  sparkles: boolean
  pattern: (typeof bannerPatterns)[number]
  border: (typeof bannerBorders)[number]
  outline: boolean
  glow: boolean
  duration: number
}

export function defaultBanner(count = 5, locale = 'zh-CN'): BannerConfig {
  return {
    count,
    text: locale === 'en' ? 'This is a line of text' : '这是一段文字',
    colors: ['#F13E78', '#9C287F'],
    textColor: '#FFFFFF',
    fontFamily: '"Noto Sans SC Variable"',
    rounded: true,
    shadow: true,
    sparkles: true,
    duration: 2000,
    pattern: 'none',
    border: 'none',
    outline: false,
    glow: false,
  }
}
