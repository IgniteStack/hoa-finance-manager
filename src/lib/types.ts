export type UserRole = 'admin' | 'neighbor'

export type RecordStatus = 'active' | 'reversed' | 'draft'

export type OwnershipStatus = 'owner' | 'renter'

export type PeriodType = 'monthly' | 'annual'

export interface User {
  id: string
  email: string
  role: UserRole
  firstName: string
  lastName: string
  houseNumber?: number
  ownershipStatus?: OwnershipStatus
  balance?: number
  phoneNumber?: string
  createdAt?: string
  neighborId?: string
}

export interface Neighbor {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  houseNumber: number
  ownershipStatus: OwnershipStatus
  balance: number
  isActive: boolean
  createdAt: string
}

export interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  concept: string
  houseNumber?: number
  neighborId?: string
  notes?: string
  status: RecordStatus
  reversedAt?: string
  createdAt: string
}

export interface Expense {
  id: string
  amount: number
  concept: string
  notes?: string
  type?: string
  date: string
  fiscalPeriodId?: string
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
