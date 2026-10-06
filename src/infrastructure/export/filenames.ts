export function exportName(name: string, extension: string, index?: number) {
  const base = name.replace(/[<>:"/\\|?*]/g, '_').trim()
  const suffix = index === undefined ? '' : `_${String(index).padStart(2, '0')}`
  return `${base}${suffix}.${extension}`
}
