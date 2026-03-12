import { createContext, useContext, ReactNode, useEffect, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import type { Notification } from '@/lib/types'
import { useAuth } from './AuthContext'
import { toast } from 'sonner'

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  requestPermission: () => Promise<void>
  permissionGranted: boolean
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useKV<Notification[]>('notifications', [])
  const { user } = useAuth()
  const [permissionGranted, setPermissionGranted] = useState(false)

  useEffect(() => {
    if ('Notification' in window) {
      setPermissionGranted(Notification.permission === 'granted')
    }
  }, [])

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('Your browser does not support notifications')
      return
    }

    if (Notification.permission === 'granted') {
      setPermissionGranted(true)
      toast.success('Notifications are already enabled')
      return
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        setPermissionGranted(true)
        toast.success('Notifications enabled successfully')
      } else {
        toast.error('Notification permission denied')
      }
    } else {
      toast.error('Notifications are blocked. Please enable them in your browser settings.')
    }
  }

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }

    setNotifications((current) => [newNotification, ...(current || [])])

    if (permissionGranted && 'Notification' in window && notification.userId === user?.id) {
      new Notification(notification.title, {
        body: notification.body,
        icon: '/favicon.ico',
        tag: newNotification.id,
        requireInteraction: false
      })
    }

    if (notification.userId === user?.id) {
      toast.info(notification.title, {
        description: notification.body
      })
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((current) =>
      (current || []).map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    if (!user) return
    setNotifications((current) =>
      (current || []).map(n => n.userId === user.id ? { ...n, read: true } : n)
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications((current) => (current || []).filter(n => n.id !== id))
  }

  const userNotifications = (notifications || []).filter(n => n.userId === user?.id)
  const unreadCount = userNotifications.filter(n => !n.read).length

  return (
    <NotificationContext.Provider
      value={{
        notifications: userNotifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        requestPermission,
        permissionGranted
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}
