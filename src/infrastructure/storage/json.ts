export function readJson<T>(storage: Storage, key: string, initial: T): T {
  const stored = storage.getItem(key)
  return stored === null ? initial : JSON.parse(stored)
}
export function writeJson(storage: Storage, key: string, value: unknown) {
  storage.setItem(key, JSON.stringify(value))
}
