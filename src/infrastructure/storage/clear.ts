export function clearAppStorage(storage: Storage = localStorage) {
  Array.from({ length: storage.length }, (_, index) => storage.key(index)!)
    .filter((key) => key.startsWith('stickgram-'))
    .forEach((key) => storage.removeItem(key))
}
