import { ref, watch, type Ref } from 'vue'
import { StorageManager } from '@ldesign/storage-core'
import type { StorageAdapter } from '@ldesign/storage-core'

export function useStorage<T>(key: string, defaultValue: T, adapter?: StorageAdapter, options?: { prefix?: string; ttl?: number }): Ref<T> {
  const manager = new StorageManager(adapter, { prefix: options?.prefix ?? 'ld' })
  const data = ref(manager.get<T>(key, defaultValue) as T) as Ref<T>
  watch(data, (v) => { v == null ? manager.remove(key) : manager.set(key, v, options?.ttl) }, { deep: true })
  return data
}
