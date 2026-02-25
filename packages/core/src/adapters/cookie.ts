import type { StorageAdapter } from '../types'

export class CookieStorageAdapter implements StorageAdapter {
  get(key: string): string | null {
    const m = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'))
    return m ? decodeURIComponent(m[2]) : null
  }
  set(key: string, value: string): void {
    document.cookie = key + '=' + encodeURIComponent(value) + '; path=/; SameSite=Lax'
  }
  remove(key: string): void {
    document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  }
  clear(): void {
    document.cookie.split(';').forEach(c => {
      const n = c.split('=')[0].trim(); if (n) this.remove(n)
    })
  }
  keys(): string[] { return document.cookie.split(';').map(c => c.split('=')[0].trim()).filter(Boolean) }
  has(key: string): boolean { return this.get(key) !== null }
}
