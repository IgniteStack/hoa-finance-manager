export type UserRole = 'admin' | 'neighbor'

export type RecordStatus = 'active' | 'reversed'

export interface User {

  houseNumber?: number


  id: string
  lastName: str
  houseNumber: n
  ownershipStatus: Own
  balance: number
}
e

  concept: string
  notes?: st
  neighborId?: stri
  status: RecordSt
  createdAt: st

  id: string
  type: PeriodTyp
  endDate: string
 

export interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  concept: string
  houseNumber?: number
  neighborId?: string
  status: RecordStatus
  reversedAt?: string
  createdAt: string
}

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
} isSetupComplete: boolean
  totalHouses: number

: string


AuthState {

olean

export interface DashboardStats {  totalIncome: number
  totalExpenses: number
  balance: number
  activeNeighbors: number
  pendingPayments: number
export interface SystemConfig {  isSetupComplete: boolean  totalHouses: number  hoaName?: string  createdAt?: string}export interface AuthState {  user: User | null  isAuthenticated: boolean
