import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CurrencyDollar, Receipt, Users, TrendUp } from '@phosphor-icons/react'
import { Neighbor, Expense, Payment } from '@/lib/types'

interface StatsCardsProps {
  neighbors: Neighbor[]
  expenses: Expense[]
  payments: Payment[]
  startDate?: string
  endDate?: string
}

export function StatsCards({ neighbors, expenses, payments, startDate, endDate }: StatsCardsProps) {
  const stats = useMemo(() => {
    const filterByDate = <T extends { date: string }>(items: T[]): T[] => {
      if (!startDate && !endDate) return items
      return items.filter(item => {
        const itemDate = new Date(item.date)
        if (startDate && itemDate < new Date(startDate)) return false
        if (endDate && itemDate > new Date(endDate)) return false
        return true
      })
    }

    const filteredExpenses = filterByDate(expenses)
    const filteredPayments = filterByDate(payments)

    const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0)
    const totalIncome = filteredPayments.reduce((sum, pay) => sum + pay.amount, 0)
    const balance = totalIncome - totalExpenses
    const activeNeighbors = neighbors.filter(n => n.active).length

    return { totalExpenses, totalIncome, balance, activeNeighbors }
  }, [neighbors, expenses, payments, startDate, endDate])

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <CurrencyDollar className="text-accent" size={20} weight="fill" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-mono font-bold text-foreground">
            ${stats.totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            From {payments.length} payments
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <Receipt className="text-destructive" size={20} weight="fill" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-mono font-bold text-foreground">
            ${stats.totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            From {expenses.length} expenses
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Balance</CardTitle>
          <TrendUp className="text-primary" size={20} weight="fill" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-mono font-bold ${stats.balance >= 0 ? 'text-accent' : 'text-destructive'}`}>
            ${Math.abs(stats.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.balance >= 0 ? 'Surplus' : 'Deficit'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Neighbors</CardTitle>
          <Users className="text-primary" size={20} weight="fill" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-mono font-bold text-foreground">
            {stats.activeNeighbors}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Of {neighbors.length} total
          </p>
        </CardContent>
      </Card>
    </div>
  )
}