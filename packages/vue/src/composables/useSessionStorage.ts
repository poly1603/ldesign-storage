import { type Ref } from 'vue'
import { SessionStorageAdapter } from '@ldesign/storage-core'
import { useStorage } from './useStorage'

export function useSessionStorage<T>(key: string, defaultValue: T, options?: { prefix?: string; ttl?: number }): Ref<T> {
  return useStorage(key, defaultValue, new SessionStorageAdapter(), options)
}
