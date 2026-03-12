import { useEffect, useState } from 'react'
import { ArrowsClockwise } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export function SyncIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [lastSync, setLastSync] = useState(new Date())

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    const syncInterval = setInterval(() => {
      if (navigator.onLine) {
        setLastSync(new Date())
      }
    }, 3000)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(syncInterval)
    }
  }, [])

  const timeSinceSync = Math.floor((new Date().getTime() - lastSync.getTime()) / 1000)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium shadow-lg backdrop-blur",
          isOnline
            ? "bg-green-500/10 text-green-700 border border-green-500/20"
            : "bg-red-500/10 text-red-700 border border-red-500/20"
        )}
      >
        <ArrowsClockwise
          size={14}
          className={cn(
            isOnline && timeSinceSync < 5 && "animate-spin"
          )}
        />
        <span>
          {isOnline ? (
            timeSinceSync < 5 ? 'Syncing...' : 'Synced'
          ) : (
            'Offline'
          )}
        </span>
      </div>
    </div>
  )
}
