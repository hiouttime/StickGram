import type { Project, ProjectMeta } from '@/core/project'
import type { ExportFormat } from '@/core/export'
import { defaultTextEmoji } from '@/core/models/textEmoji'
import type { TextEmojiConfig } from '@/core/models/textEmoji'
import { defaultBanner } from '@/core/models/banner'
import type { BannerConfig } from '@/core/models/banner'
import { defaultSticker } from '@/core/models/sticker'
import type { StickerConfig } from '@/core/models/sticker'

// One-time conversion of the earlier frame/layer data model at the storage boundary.
export type LegacyProject = Omit<ProjectMeta, 'format'> & {
  type: 'emoji' | 'sticker' | 'sequential-emoji'
  format: ExportFormat | 'animated'
  textEmoji?: TextEmojiConfig
  banner?: BannerConfig
  sticker?: StickerConfig
}
export function normalizeProject(project: Project | LegacyProject): Project {
  if ('config' in project) return project
  const { id, name, format, createdAt, updatedAt, thumbnail, type } = project
  const meta = {
    id,
    name,
    createdAt,
    updatedAt,
    thumbnail,
    format: format === 'animated' ? ('video' as const) : format,
  }
  switch (type) {
    case 'emoji':
      return { ...meta, type, config: { ...defaultTextEmoji(), ...project.textEmoji } }
    case 'sticker':
      return { ...meta, type, config: { ...defaultSticker(), ...project.sticker } }
    case 'sequential-emoji':
      return { ...meta, type, config: { ...defaultBanner(), ...project.banner } }
  }
}
