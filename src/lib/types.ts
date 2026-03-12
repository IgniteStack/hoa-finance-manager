export type UserRole = 'admin' | 'neighbor'

export type OwnershipStatus = 'owner' | 'tenant'

export type RecordStatus = 'draft' | 'active' | 'reversed'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  neighborId?: string
  phoneNumber: string
  createdAt: string
}

export interface Neighbor {
  id: string
  houseNumber: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  ownershipStatus: OwnershipStatus
  isActive: boolean
  balance: number
  createdAt: string
}

export interface Expense {
  id: string
  amount: number
  date: string
  concept: string
  notes?: string
  status: RecordStatus
  postedAt?: string
  reversedAt?: string
  fiscalPeriodId?: string
  createdAt: string
}

export type PeriodType = 'monthly' | 'quarterly' | 'yearly' | 'custom'

export interface FiscalPeriod {
  id: string
  name: string
  type: PeriodType
  startDate: string
  endDate: string
  isClosed: boolean
  closedAt?: string
  createdAt: string
}

export interface Payment {
  id: string
  amount: number
  date: string
  concept?: string
  neighborId: string
  houseNumber: string
  bankAccount?: string
  status: RecordStatus
  postedAt?: string
  reversedAt?: string
  fiscalPeriodId?: string
  createdAt: string
}

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