import { type Ref } from 'vue'
import { LocalStorageAdapter } from '@ldesign/storage-core'
import { useStorage } from './useStorage'

export function useLocalStorage<T>(key: string, defaultValue: T, options?: { prefix?: string; ttl?: number }): Ref<T> {
  return useStorage(key, defaultValue, new LocalStorageAdapter(), options)
}
