/** Project data is JSON; snapshots also remove nested Vue proxies. */
export function snapshot<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}
