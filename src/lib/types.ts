export type UserRole = 'admin' | 'neighbor'

export type OwnershipStatus = 'owner' | 'tenant'

export type RecordStatus = 'active' | 'reversed' | 'draft'

export type PeriodType = 'monthly' | 'annual'

export interface User {
  id: string
  email: string
  role: UserRole
  houseNumber?: number
  neighborId?: string
  createdAt: string
}

export interface Neighbor {
  id: string
  firstName: string
  lastName: string
  email: string
  houseNumber: number
  phoneNumber?: string
  ownershipStatus: OwnershipStatus
  isActive: boolean
  balance: number
  createdAt: string
}

export interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  concept: string
  date: string
  notes?: string
  houseNumber?: number
  neighborId?: string
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
  createdAt: string
}

export interface PaymentRecord {
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

export type Payment = PaymentRecord

export type Expense = Transaction & { type: 'expense' }

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
