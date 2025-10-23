/**
 * @ldesign/storage - 统一存储抽象层
 */

export interface StorageAdapter {
  get(key: string): Promise<any>
  set(key: string, value: any): Promise<void>
  remove(key: string): Promise<void>
  clear(): Promise<void>
}

export class UnifiedStorage {
  private adapter: StorageAdapter

  constructor(adapter: StorageAdapter) {
    this.adapter = adapter
  }

  async get<T>(key: string): Promise<T | null> {
    return await this.adapter.get(key)
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.adapter.set(key, value)
  }

  async remove(key: string): Promise<void> {
    await this.adapter.remove(key)
  }

  async clear(): Promise<void> {
    await this.adapter.clear()
  }
}

export function createStorage(adapter: StorageAdapter) {
  return new UnifiedStorage(adapter)
}






