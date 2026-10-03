export interface TelegramStickerSpec {
  type: 'static' | 'animated' | 'video'
  width: number
  height: number
  maxFileSize: number // bytes
  maxDuration?: number // seconds
  fps?: number
  codec?: string
  container?: string
  mimeType: string
}

export const STICKER_SPECS: Record<string, TelegramStickerSpec> = {
  'sticker-static': {
    type: 'static',
    width: 512,
    height: 512,
    maxFileSize: 512 * 1024,
    mimeType: 'image/webp',
  },
  'sticker-animated': {
    type: 'animated',
    width: 512,
    height: 512,
    maxFileSize: 64 * 1024,
    maxDuration: 3,
    fps: 60,
    mimeType: 'application/x-tgsticker',
  },
  'sticker-video': {
    type: 'video',
    width: 512,
    height: 512,
    maxFileSize: 256 * 1024,
    maxDuration: 3,
    fps: 30,
    codec: 'VP9',
    container: 'WebM',
    mimeType: 'video/webm',
  },
  'emoji-static': {
    type: 'static',
    width: 100,
    height: 100,
    maxFileSize: 512 * 1024,
    mimeType: 'image/webp',
  },
  'emoji-animated': {
    type: 'animated',
    width: 100,
    height: 100,
    maxFileSize: 64 * 1024,
    maxDuration: 3,
    fps: 60,
    mimeType: 'application/x-tgsticker',
  },
  'emoji-video': {
    type: 'video',
    width: 100,
    height: 100,
    maxFileSize: 256 * 1024,
    maxDuration: 3,
    fps: 30,
    codec: 'VP9',
    container: 'WebM',
    mimeType: 'video/webm',
  },
}
