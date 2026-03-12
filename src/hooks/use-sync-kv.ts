import { useEffect, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'

export function useSyncKV<T>(key: string, defaultValue: T) {
  const [value, setValue, deleteValue] = useKV<T>(key, defaultValue)

    } catch (error) {
    }

    sync()
    const interval = setInterval((
    }, 
    return () => clea

}









    return () => clearInterval(interval)
  }, [sync])

  return [value, setValue, deleteValue, sync] as const
}