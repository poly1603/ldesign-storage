import type { StorageAdapter, StorageOptions, StorageItem } from '../types'
import { LocalStorageAdapter } from '../adapters/local'

export class StorageManager {
  private adapter: StorageAdapter
  private options: Required<StorageOptions>

  constructor(adapter?: StorageAdapter, options?: StorageOptions) {
    this.adapter = adapter || new LocalStorageAdapter()
    this.options = {
      prefix: options?.prefix ?? 'ld',
      defaultTTL: options?.defaultTTL ?? 0,
      serializer: options?.serializer ?? { serialize: JSON.stringify, deserialize: JSON.parse },
      version: options?.version ?? 1,
    }
  }

  set<T>(key: string, value: T, ttl?: number): void {
    const item: StorageItem<T> = { value, createdAt: Date.now(), version: this.options.version }
    const expires = ttl ?? this.options.defaultTTL
    if (expires > 0) item.expires = Date.now() + expires
    this.adapter.set(this.prefixKey(key), this.options.serializer.serialize(item))
  }

  get<T>(key: string, defaultValue?: T): T | undefined {
    const raw = this.adapter.get(this.prefixKey(key))
    if (!raw) return defaultValue
    try {
      const item: StorageItem<T> = this.options.serializer.deserialize(raw)
      if (item.expires && Date.now() > item.expires) { this.remove(key); return defaultValue }
      if (item.version !== undefined && item.version !== this.options.version) { this.remove(key); return defaultValue }
      return item.value
    } catch { return defaultValue }
  }

  remove(key: string): void { this.adapter.remove(this.prefixKey(key)) }
  has(key: string): boolean { return this.get(key) !== undefined }

  clear(): void {
    const p = this.options.prefix + ':'
    this.adapter.keys().filter(k => k.startsWith(p)).forEach(k => this.adapter.remove(k))
  }

  keys(): string[] {
    const p = this.options.prefix + ':'
    return this.adapter.keys().filter(k => k.startsWith(p)).map(k => k.slice(p.length))
  }

  size(): number {
    let total = 0
    const p = this.options.prefix + ':'
    for (const key of this.adapter.keys()) {
      if (key.startsWith(p)) { const raw = this.adapter.get(key); if (raw) total += raw.length * 2 }
    }
    return total
  }

  destroy(): void { this.clear() }

  private prefixKey(key: string): string { return this.options.prefix + ':' + key }
}
