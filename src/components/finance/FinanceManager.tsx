import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Expense, Payment, User } from '@/lib/types'
import { useAuth } from '@/contexts/AuthContext'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ExpenseList } from './ExpenseList'
import { PaymentList } from './PaymentList'

export function FinanceManager() {
  const [expenses] = useKV<Expense[]>('expenses', [])
  const [payments] = useKV<Payment[]>('payments', [])
  const [members] = useKV<User[]>('system-users', [])
  const { isAdmin } = useAuth()

  return (
    <Card className="p-6">
      <Tabs defaultValue="expenses" className="space-y-6">
        <TabsList>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="expenses">
          <ExpenseList />
        </TabsContent>
        
        <TabsContent value="payments">
          <PaymentList members={members || []} />
        </TabsContent>
      </Tabs>
    </Card>
  )
}