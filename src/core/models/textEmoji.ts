import type { TextStyle } from '../typography'

export type TransitionType =
  | 'gleam-h'
  | 'gleam-d'
  | 'fade'
  | 'zoom'
  | 'cut'
  | 'slide-left'
  | 'slide-up'
  | 'flip'
  | 'spin'
  | 'iris'
  | 'blinds'

export interface TextEmojiConfig extends TextStyle {
  mode: 'single' | 'dual'
  textA: string
  textB: string
  gradientColors: string[]
  duration: number
  holdRatio: number
  backgroundColor: string
  transition: TransitionType
}

export function defaultTextEmoji(locale = 'zh-CN'): TextEmojiConfig {
  return {
    mode: 'dual',
    textA: locale === 'en' ? 'STAY HAPPY' : '天天开心',
    textB: locale === 'en' ? 'GOOD LUCK' : '好运连连',
    gradientColors: ['#FF69FF', '#6B5BFF', '#00BFFF'],
    fontFamily: 'sans-serif',
    duration: 2000,
    holdRatio: 0.35,
    backgroundColor: 'transparent',
    transition: 'gleam-h',
  }
}
