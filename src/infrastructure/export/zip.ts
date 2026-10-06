import { zipSync } from 'fflate'
export async function createZip(files: { name: string; blob: Blob }[]) {
  const entries = Object.fromEntries(
    await Promise.all(
      files.map(async (file) => [file.name, new Uint8Array(await file.blob.arrayBuffer())]),
    ),
  )
  const bytes = zipSync(entries, { level: 0 })
  return new Blob([bytes as Uint8Array<ArrayBuffer>], { type: 'application/zip' })
}
