export type UserRole = 'admin' | 'neighbor'

export type OwnershipStatus = 'owner' | 'tenant'

export type RecordStatus = 'draft' | 'active' | 'reversed'

export type PeriodType = 'monthly' | 'quarterly' | 'yearly' | 'custom'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  phoneNumber?: string
  neighborId?: string
  password?: string
  mustChangePassword?: boolean
  securityQuestion?: string
  securityAnswer?: string
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

export interface Expense {
  id: string
  concept: string
  amount: number
  category?: string
  date: string
  description?: string
  notes?: string
  fiscalPeriodId?: string
  status: RecordStatus
  postedAt?: string
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
  postedAt?: string
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

export interface Notification {
  id: string
  userId: string
  type: 'message' | 'payment' | 'expense' | 'system'
  title: string
  body: string
  read: boolean
  relatedId?: string
  createdAt: string
}