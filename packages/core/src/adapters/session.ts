import type { StorageAdapter } from '../types'

export class SessionStorageAdapter implements StorageAdapter {
  get(key: string): string | null { return sessionStorage.getItem(key) }
  set(key: string, value: string): void { sessionStorage.setItem(key, value) }
  remove(key: string): void { sessionStorage.removeItem(key) }
  clear(): void { sessionStorage.clear() }
  keys(): string[] {
    const r: string[] = []
    for (let i = 0; i < sessionStorage.length; i++) { const k = sessionStorage.key(i); if (k) r.push(k) }
    return r
  }
  has(key: string): boolean { return sessionStorage.getItem(key) !== null }
}
