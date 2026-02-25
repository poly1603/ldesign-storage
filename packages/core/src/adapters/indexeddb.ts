import type { StorageAdapter } from '../types'

const DB_NAME = 'ldesign_storage'
const STORE_NAME = 'kv'
const DB_VERSION = 1

/**
 * IndexedDB 存储适配器
 *
 * 适用于大数据量存储场景，支持异步读写。
 * 注意：由于 StorageAdapter 接口是同步的，此适配器内部使用同步缓存 + 异步持久化策略：
 * - 读取优先从内存缓存返回
 * - 写入同时更新缓存和异步写入 IndexedDB
 * - 初始化时从 IndexedDB 加载所有数据到缓存
 */
export class IndexedDBAdapter implements StorageAdapter {
  private cache = new Map<string, string>()
  private db: IDBDatabase | null = null
  private ready: Promise<void>

  constructor() {
    this.ready = this.init()
  }

  private init(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof indexedDB === 'undefined') {
        console.warn('[IndexedDBAdapter] IndexedDB 不可用，回退到内存模式')
        resolve()
        return
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME)
        }
      }

      request.onsuccess = () => {
        this.db = request.result
        // 将 IndexedDB 中的数据加载到缓存
        this.loadAll().then(resolve).catch(() => resolve())
      }

      request.onerror = () => {
        console.warn('[IndexedDBAdapter] 打开数据库失败，回退到内存模式')
        resolve()
      }
    })
  }

  private loadAll(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) { resolve(); return }

      const tx = this.db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const request = store.openCursor()

      request.onsuccess = () => {
        const cursor = request.result
        if (cursor) {
          if (typeof cursor.key === 'string' && typeof cursor.value === 'string') {
            this.cache.set(cursor.key, cursor.value)
          }
          cursor.continue()
        } else {
          resolve()
        }
      }

      request.onerror = () => reject(request.error)
    })
  }

  get(key: string): string | null {
    return this.cache.get(key) ?? null
  }

  set(key: string, value: string): void {
    this.cache.set(key, value)
    this.asyncPut(key, value)
  }

  remove(key: string): void {
    this.cache.delete(key)
    this.asyncDelete(key)
  }

  clear(): void {
    this.cache.clear()
    this.asyncClear()
  }

  keys(): string[] {
    return Array.from(this.cache.keys())
  }

  has(key: string): boolean {
    return this.cache.has(key)
  }

  /**
   * 等待 IndexedDB 初始化完成
   * 在需要确保数据已加载时调用
   */
  async waitReady(): Promise<void> {
    await this.ready
  }

  private asyncPut(key: string, value: string): void {
    if (!this.db) return
    try {
      const tx = this.db.transaction(STORE_NAME, 'readwrite')
      tx.objectStore(STORE_NAME).put(value, key)
    } catch { /* 静默失败，缓存中已有数据 */ }
  }

  private asyncDelete(key: string): void {
    if (!this.db) return
    try {
      const tx = this.db.transaction(STORE_NAME, 'readwrite')
      tx.objectStore(STORE_NAME).delete(key)
    } catch { /* 静默失败 */ }
  }

  private asyncClear(): void {
    if (!this.db) return
    try {
      const tx = this.db.transaction(STORE_NAME, 'readwrite')
      tx.objectStore(STORE_NAME).clear()
    } catch { /* 静默失败 */ }
  }
}
