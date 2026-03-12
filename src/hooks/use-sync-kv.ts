import { useEffect, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'

export function useSyncKV<T>(key: string, defaultValue: T, pollInterval = 2000) {
  const [value, setValue, deleteValue] = useKV<T>(key, defaultValue)

  const forceRefresh = useCallback(async () => {
    const freshValue = await window.spark.kv.get<T>(key)
    if (freshValue !== undefined) {
      setValue(freshValue)
    }
  }, [key, setValue])

  useEffect(() => {
    const interval = setInterval(forceRefresh, pollInterval)
    return () => clearInterval(interval)
  }, [forceRefresh, pollInterval])

  return [value, setValue, deleteValue, forceRefresh] as const
}
