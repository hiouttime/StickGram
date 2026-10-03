import { TelegramStickerSpec } from '../types/sticker';

export function exportAsImage(canvas: HTMLCanvasElement, format: 'png' | 'webp', quality: number = 1.0): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to export canvas to blob'));
      }
    }, `image/${format}`, quality);
  });
}

export function exportAsWebM(frames: ImageData[], fps: number, duration: number): Promise<Blob> {
  return Promise.reject(new Error('Not implemented yet'));
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function canvasToImageData(canvas: HTMLCanvasElement): ImageData {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2d context');
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

export function validateExport(blob: Blob, spec: TelegramStickerSpec): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (blob.size > spec.maxFileSize) {
    errors.push(`File size (${blob.size} bytes) exceeds maximum allowed size (${spec.maxFileSize} bytes).`);
  }
  return {
    valid: errors.length === 0,
    errors,
  };
}
