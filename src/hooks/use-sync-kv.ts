import { useEffect, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'


    const freshValue = await window.spark.kv.get<T>(key)

  const sync = useCallback(async () => {
    const freshValue = await spark.kv.get<T>(key)
    if (freshValue !== undefined) {
      setValue(freshValue)
    }
  }, [key, setValue])

}




  return [value, setValue, deleteValue] as const
}
