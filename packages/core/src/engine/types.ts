import type { StorageOptions } from '../types'

export interface StorageEnginePluginOptions extends StorageOptions {
  dependencies?: string[]
}
