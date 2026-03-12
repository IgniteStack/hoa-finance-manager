import { useKV } from '@github/spark/hooks'
import { Neighbor, Expense, Payment } from '@/lib/types'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { FinancialCharts } from '@/components/dashboard/FinancialCharts'

export function DashboardPage() {
  const [neighbors] = useKV<Neighbor[]>('neighbors', [])
  const [expenses] = useKV<Expense[]>('expenses', [])
  const [payments] = useKV<Payment[]>('payments', [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Community financial overview and analytics</p>
      </div>

      <StatsCards 
        neighbors={neighbors || []} 
        expenses={expenses || []} 
        payments={payments || []} 
      />

      <FinancialCharts 
        expenses={expenses || []} 
        payments={payments || []} 
      />
    </div>
  )
}