import { useEffect, useCallback } from 'react'


  const sync = useCallback(async () => {
      const latestValue = await window.spark.kv.get<T>(key)

  const sync = useCallback(async () => {
    try {
      const latestValue = await spark.kv.get<T>(key)
      if (latestValue !== undefined) {
        setValue(() => latestValue)
      }
    sync()
      console.error('Sync error:', error)
    }
  }, [key, setValue])

  useEffect(() => {
}
    const interval = setInterval(() => {

    }, 5000)

    return () => clearInterval(interval)


  return [value, setValue, deleteValue, sync] as const
}
