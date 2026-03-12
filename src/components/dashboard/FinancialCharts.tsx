import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { Expense, Payment } from '@/lib/types'
import { useMemo } from 'react'

interface FinancialChartsProps {
  expenses: Expense[]
  payments: Payment[]
  startDate?: string
  endDate?: string
}

const COLORS = ['oklch(0.45 0.08 200)', 'oklch(0.68 0.15 35)', 'oklch(0.55 0.22 25)', 'oklch(0.50 0.08 150)', 'oklch(0.60 0.15 60)']

export function FinancialCharts({ expenses, payments, startDate, endDate }: FinancialChartsProps) {
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

  const monthlyData = useMemo(() => {
    const dataMap = new Map<string, { income: number; expenses: number }>()
    
    filteredPayments.forEach(payment => {
      const month = new Date(payment.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
      const current = dataMap.get(month) || { income: 0, expenses: 0 }
      dataMap.set(month, { ...current, income: current.income + payment.amount })
    })
    
    filteredExpenses.forEach(expense => {
      const month = new Date(expense.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
      const current = dataMap.get(month) || { income: 0, expenses: 0 }
      dataMap.set(month, { ...current, expenses: current.expenses + expense.amount })
    })
    
    return Array.from(dataMap.entries())
      .map(([month, data]) => ({ month, ...data, balance: data.income - data.expenses }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
  }, [filteredPayments, filteredExpenses])

  const expensesByCategory = useMemo(() => {
    const categoryMap = new Map<string, number>()
    
    filteredExpenses.forEach(expense => {
      const category = expense.concept || 'Other'
      categoryMap.set(category, (categoryMap.get(category) || 0) + expense.amount)
    })
    
    return Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }))
  }, [filteredExpenses])

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Income vs Expenses Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.01 200)" />
              <XAxis dataKey="month" stroke="oklch(0.50 0 0)" />
              <YAxis stroke="oklch(0.50 0 0)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'oklch(1 0 0)', 
                  border: '1px solid oklch(0.88 0.01 200)',
                  borderRadius: '0.5rem'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="oklch(0.68 0.15 35)" strokeWidth={2} name="Income" />
              <Line type="monotone" dataKey="expenses" stroke="oklch(0.55 0.22 25)" strokeWidth={2} name="Expenses" />
              <Line type="monotone" dataKey="balance" stroke="oklch(0.45 0.08 200)" strokeWidth={2} name="Balance" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.01 200)" />
              <XAxis dataKey="month" stroke="oklch(0.50 0 0)" />
              <YAxis stroke="oklch(0.50 0 0)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'oklch(1 0 0)', 
                  border: '1px solid oklch(0.88 0.01 200)',
                  borderRadius: '0.5rem'
                }}
              />
              <Legend />
              <Bar dataKey="income" fill="oklch(0.68 0.15 35)" name="Income" />
              <Bar dataKey="expenses" fill="oklch(0.55 0.22 25)" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expensesByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expensesByCategory.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'oklch(1 0 0)', 
                  border: '1px solid oklch(0.88 0.01 200)',
                  borderRadius: '0.5rem'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}