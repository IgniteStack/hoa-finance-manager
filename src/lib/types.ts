export type UserRole = 'administration' | 'user' | 'auditor'

export type OwnershipStatus = 'owner' | 'tenant'

export type RecordStatus = 'draft' | 'active' | 'reversed'

export type PeriodType = 'monthly' | 'quarterly' | 'yearly' | 'custom'

export interface User {
  id: string
  firstName: string
  middleName?: string
  lastName: string
  secondLastName?: string
  email: string
  role: UserRole
  houseNumber: number
  phoneNumber?: string
  phoneNumber2?: string
  ownershipStatus: OwnershipStatus
  isActive: boolean
  balance: number
  password?: string
  mustChangePassword?: boolean
  securityQuestion?: string
  securityAnswer?: string
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

export interface MemberDocument {
  id: string
  memberId: string
  fileName: string
  fileType: string
  fileSize: number
  category: 'contract' | 'receipt' | 'identification' | 'other'
  description?: string
  uploadedBy: string
  uploadedAt: string
  fileData: string
}