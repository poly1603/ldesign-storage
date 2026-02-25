import type { StorageEnginePluginOptions } from './types'
import { StorageManager } from '../core/manager'

export const storageStateKeys = {
  MANAGER: 'storage:manager' as const,
} as const

export const storageEventKeys = {
  INSTALLED: 'storage:installed' as const,
  UNINSTALLED: 'storage:uninstalled' as const,
} as const

export function createStorageEnginePlugin(options: StorageEnginePluginOptions = {}) {
  let manager: StorageManager | null = null

  return {
    name: 'storage',
    version: '1.0.0',
    dependencies: options.dependencies ?? [],

    async install(context: any) {
      const engine = context.engine || context
      manager = new StorageManager(undefined, options)
      engine.state?.set(storageStateKeys.MANAGER, manager)
      engine.events?.emit(storageEventKeys.INSTALLED, { name: 'storage' })
      engine.logger?.info('[Storage Plugin] installed')
    },

    async uninstall(context: any) {
      const engine = context.engine || context
      manager?.destroy()
      manager = null
      engine.state?.delete(storageStateKeys.MANAGER)
      engine.events?.emit(storageEventKeys.UNINSTALLED, {})
    },
  }
}
