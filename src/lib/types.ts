export type UserRole = 'admin' | 'neighbor'

export type OwnershipStatus = 'owner' | 'tenant'

export type RecordStatus = 'draft' | 'active' | 'reversed'

export interface User {
  firstName: string
  role: UserRol
  role: UserRole
  neighborId?: string
 

  phoneNumber: string
  postedAt?:
  createdAt: string

  id: string
  amount: number
  notes?: string
  status: RecordStatu
  fiscalPeriodId?: string
}
export interface 
  closedAt?: string
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
}

export interface Payment {
  id: stringng
  closedAt?: string
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