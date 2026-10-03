import { ProjectType, StickerFormat, Project } from '../types/project';
import { TelegramStickerSpec, STICKER_SPECS } from '../types/sticker';

export function getStickerSpec(type: ProjectType, format: StickerFormat): TelegramStickerSpec {
  const key = `${type === 'sequential-emoji' ? 'emoji' : type}-${format}`;
  const spec = STICKER_SPECS[key];
  if (!spec) {
    return STICKER_SPECS['sticker-static'];
  }
  return spec;
}

export function getCanvasSize(type: ProjectType): { width: number, height: number } {
  if (type === 'sticker') {
    return { width: 512, height: 512 };
  }
  return { width: 100, height: 100 };
}

export function validateDimensions(width: number, height: number, type: ProjectType): boolean {
  if (type === 'sticker') {
    return width <= 512 && height <= 512 && (width === 512 || height === 512);
  }
  return width <= 100 && height <= 100 && (width === 100 || height === 100);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export function getExportFileName(project: Project, index?: number): string {
  const safeName = project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const ext = project.format === 'video' ? 'webm' : (project.format === 'animated' ? 'tgs' : 'webp');
  const suffix = typeof index === 'number' ? `_${String(index).padStart(3, '0')}` : '';
  return `${safeName}${suffix}.${ext}`;
}

export function getFFmpegCommand(spec: TelegramStickerSpec): string {
  if (spec.type === 'video') {
    return `ffmpeg -i input.webm -c:v libvpx-vp9 -pix_fmt yuva420p -vf "scale=${spec.width}:${spec.height}" -b:v 0 -crf 30 -r ${spec.fps || 30} -t ${spec.maxDuration || 3} -an output.webm`;
  }
  return '';
}
