import type { App } from 'vue'
import { StorageManager } from '@ldesign/storage-core'

export function createStoragePlugin(options?: { prefix?: string }) {
  const manager = new StorageManager(undefined, { prefix: options?.prefix ?? 'ld' })
  return {
    install(app: App) {
      app.provide('ldesign-storage', manager)
      app.config.globalProperties.$storage = manager
    },
  }
}
