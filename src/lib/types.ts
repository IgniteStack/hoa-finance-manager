export type UserRole = 'admin' | 'neighbor'

export type OwnershipStatus = 'owner' | 'tenant'

export type RoleType = 'neighbor' | 'management'

export interface User {
  id: string
  email: string
  role: UserRole
  neighborId?: string
}

export interface Neighbor {
  id: string
  firstName: string
  secondName?: string
  lastName: string
  secondLastName?: string
  houseNumber: string
  phoneNumber: string
  ownershipStatus: OwnershipStatus
  roleType: RoleType
  active: boolean
  createdAt: string
}

export interface Expense {
  id: string
  concept: string
  amount: number
  date: string
  notes?: string
  createdAt: string
}

export interface Payment {
  id: string
  concept: string
  amount: number
  date: string
  neighborId: string
  houseNumber: string
  bankAccount?: string
  createdAt: string
}

export type PeriodType = 'monthly' | 'quarterly' | 'yearly' | 'custom'

export interface FiscalPeriod {
  type: PeriodType
  startDate: string
  endDate: string
}

export interface DashboardStats {
  totalIncome: number
  totalExpenses: number
  balance: number
  activeNeighbors: number
  pendingPayments: number
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}