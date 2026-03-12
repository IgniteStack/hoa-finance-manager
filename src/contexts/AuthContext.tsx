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
      setUser((currentUser) => ({
        id: '1',
        email: 'admin@hoa.com',
        role: 'admin'
      }))
      return true
    } else if (email === 'neighbor@hoa.com' && password === 'neighbor123') {
      setUser((currentUser) => ({
        id: '2',
        email: 'neighbor@hoa.com',
        role: 'neighbor',
        neighborId: 'n1'
      }))
      return true
    }
    return false
  }

  const logout = () => {
    setUser((currentUser) => null)
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