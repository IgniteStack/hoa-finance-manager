import React, { createContext, useContext, ReactNode } from 'react'
import { useKV } from '@github/spark/hooks'
import { User, AuthState } from '@/lib/types'
import { verifyPassword } from '@/lib/password-utils'

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; mustChangePassword?: boolean }>
  logout: () => void
  updatePassword: (newPassword: string) => void
  isAdmin: boolean
  users: User[]
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useKV<User | null>('auth-user', null)
  const [users] = useKV<User[]>('system-users', [])

  const login = async (email: string, password: string): Promise<{ success: boolean; mustChangePassword?: boolean }> => {
    const foundUser = (users || []).find(u => u.email === email)
    
    if (!foundUser || !foundUser.password) {
      return { success: false }
    }

    const isValid = verifyPassword(password, foundUser.password)
    
    if (isValid) {
      const userToSet = { ...foundUser }
      delete userToSet.password
      setUser(() => userToSet)
      return { success: true, mustChangePassword: foundUser.mustChangePassword }
    }
    
    return { success: false }
  }

  const updatePassword = (newPassword: string) => {
    if (!user) return
    setUser((currentUser) => {
      if (!currentUser) return null
      return { ...currentUser, mustChangePassword: false }
    })
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
        updatePassword,
        isAdmin: currentUser?.role === 'admin',
        users: users || []
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