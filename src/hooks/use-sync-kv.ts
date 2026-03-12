import { useEffect, useCallback } from 'react'


export function useSyncKV<T>(key: string, defaultValue: T, pollInterval = 2000) {
  const [value, setValue, deleteValue] = useKV<T>(key, defaultValue)

      setValue(freshValue)
  }, [key, setValue])
  useEffect(() => {
    return () => clearInte

}








