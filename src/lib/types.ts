export type UserRole = 'admin' | 'neighbor'

export type OwnershipStatus = 'owner' | 'tenant'

export type RoleType = 'neighbor' | 'management'

export type RecordStatus = 'draft' | 'posted' | 'reversed'

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
  status: RecordStatus
  postedAt?: string
  reversedAt?: string
  fiscalPeriodId?: string
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

export interface SystemConfig {
  isSetupComplete: boolean
  totalHouses: number
  setupCompletedAt?: string
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