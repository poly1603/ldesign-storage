export interface StorageAdapter {
  get(key: string): string | null
  set(key: string, value: string): void
  remove(key: string): void
  clear(): void
  keys(): string[]
  has(key: string): boolean
}

export interface StorageItem<T = any> {
  value: T
  expires?: number
  createdAt: number
  version?: number
}

export interface StorageOptions {
  prefix?: string
  defaultTTL?: number
  serializer?: SerializerOptions
  version?: number
}

export interface SerializerOptions {
  serialize: (value: any) => string
  deserialize: (raw: string) => any
}
