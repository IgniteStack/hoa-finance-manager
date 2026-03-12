export type UserRole = 'admin' | 'neighbor'

export type RecordStatus = 'active' | 'reversed'

export type OwnershipStatus = 'owner' | 'renter'

export type PeriodType = 'monthly' | 'annual'

export interface FiscalPeriod {
  id: string
  type: PeriodType
  startDate: string
  endDate: string
  closedAt?: string
}

export interface PaymentRecord {
  id: string
  neighborId: string
  houseNumber: number
  amount: number
  concept?: string
  status: RecordStatus
  reversedAt?: string
  createdAt: string
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

export interface DashboardStats {
  totalIncome: number
  totalExpenses: number
  balance: number
  activeNeighbors: number
  pendingPayments: number
  status: RecordStatus
  reversedAt?: string
  createdAt: string
}

export interface Payment {
  id: string
  neighborId: string
  houseNumber: number
  amount: number
  concept?: string
  date: string
  bankAccount?: string
  fiscalPeriodId?: string
  status: RecordStatus
  reversedAt?: string
  createdAt: string
}

export interface FiscalPeriod {
  id: string
  name: string
  type: PeriodType
  startDate: string
  endDate: string
  isClosed: boolean
  closedAt?: string
  createdAt?: string
}

export interface PaymentRecord {
  id: string
  neighborId: string
  houseNumber: number
  amount: number
  concept?: string
  status: RecordStatus
  reversedAt?: string
  createdAt: string
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

export interface DashboardStats {
  totalIncome: number
  totalExpenses: number
  balance: number
  activeNeighbors: number
  pendingPayments: number
}