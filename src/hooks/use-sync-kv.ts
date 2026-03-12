import { useEffect, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'

export function useSyncKV<T>(key: string, defaultValue: T) {
  const [value, setValue, deleteValue] = useKV<T>(key, defaultValue)

  const sync = useCallback(async () => {
    try {
      const freshValue = await window.spark.kv.get<T>(key)
      if (freshValue !== undefined) {
        setValue(() => freshValue)
      }
    } catch (error) {
      console.error(`Error syncing KV for key "${key}":`, error)
    }
  }, [key, setValue])

  useEffect(() => {
    sync()

    const interval = setInterval(() => {
      sync()
    }, 5000)

    return () => clearInterval(interval)
  }, [sync])

  return [value, setValue, deleteValue, sync] as const
}
