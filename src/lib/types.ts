export type UserRole = 'admin' | 'neighbor'

export type OwnershipStatus = 'owner' | 'tenant'

  firstName: string

  neighborId?: string
  createdAt:

  id: string
  firstName: st
  email: string
  ownershipStatus: Ow
  balance: number
  createdAt: string
e

  concept: string
  status: Re
  reversedAt?: string
  createdAt: string


  id: string
  type: PeriodType
  endDate: string
  closedAt?: stri
}
e

  concept?: string
  houseNumbe
  status: Record
  reversedAt?:
  createdAt: stri

  totalIncome: number
  balance: number
  pendingPayments: nu

  isSetupComplete: 
 

export interface AuthState {



























export interface DashboardStats {
  totalIncome: number
  totalExpenses: number
  balance: number
  activeNeighbors: number
  pendingPayments: number
}

export interface SystemConfig {
  isSetupComplete: boolean
  totalHouses: number
  hoaName?: string
  createdAt?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}