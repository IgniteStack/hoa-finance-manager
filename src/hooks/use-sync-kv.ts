import { useEffect, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'

export function useSyncKV<T>(key: string, defaultValue: T, pollInterval = 2000) {
  const [value, setValue, deleteValue] = useKV<T>(key, defaultValue)

  const sync = useCallback(async () => {
    const freshValue = await window.spark.kv.get<T>(key)
    if (freshValue !== undefined) {
      setValue(freshValue)
    }
  }, [key, setValue])

  useEffect(() => {
    const interval = setInterval(sync, pollInterval)
    return () => clearInterval(interval)
  }, [sync, pollInterval])

  return [value, setValue, deleteValue] as const
}




