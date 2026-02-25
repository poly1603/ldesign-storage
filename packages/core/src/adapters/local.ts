import type { StorageAdapter } from '../types'

export class LocalStorageAdapter implements StorageAdapter {
  get(key: string): string | null { return localStorage.getItem(key) }
  set(key: string, value: string): void { localStorage.setItem(key, value) }
  remove(key: string): void { localStorage.removeItem(key) }
  clear(): void { localStorage.clear() }
  keys(): string[] {
    const r: string[] = []
    for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k) r.push(k) }
    return r
  }
  has(key: string): boolean { return localStorage.getItem(key) !== null }
}
