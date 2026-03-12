import { createContext, useContext, ReactNode } from 'react'
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
      setUser({
        id: '1',
        email: 'admin@hoa.com',
        role: 'admin'
      })
      return true
    } else if (email === 'neighbor@hoa.com' && password === 'neighbor123') {
      setUser({
        id: '2',
        email: 'neighbor@hoa.com',
        role: 'neighbor',
        neighborId: 'n1'
      })
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isAdmin: user?.role === 'admin'
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