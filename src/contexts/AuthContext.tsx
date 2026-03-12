import React, { createContext, useContext, ReactNode } from 'react'
import { useKV } from '@github/spark/hooks'
import { User, AuthState } from '@/lib/types'

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useKV<User | null>('auth-user', null)

  const login = async (email: string, password: string): Promise<boolean> => {
    if (email === 'admin@hoa.com' && password === 'admin123') {
      setUser(() => ({
        id: '1',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@hoa.com',
        role: 'admin',
        phoneNumber: '',
        createdAt: new Date().toISOString()
      }))
      return true
    } else if (email === 'neighbor@hoa.com' && password === 'neighbor123') {
      setUser(() => ({
        id: '2',
        firstName: 'Neighbor',
        lastName: 'User',
        email: 'neighbor@hoa.com',
        role: 'neighbor',
        neighborId: 'n1',
        phoneNumber: '',
        createdAt: new Date().toISOString()
      }))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
  }

  const currentUser = user ?? null

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
        isAdmin: currentUser?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}