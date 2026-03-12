import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { FiscalPeriod, PeriodType, Expense, Payment } from '@/lib/types'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, LockKey, LockKeyOpen, CalendarBlank } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export function FiscalPeriodManager() {
  const [periods, setPeriods] = useKV<FiscalPeriod[]>('fiscal-periods', [])
  const [expenses, setExpenses] = useKV<Expense[]>('expenses', [])
  const [payments, setPayments] = useKV<Payment[]>('payments', [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [closingPeriod, setClosingPeriod] = useState<FiscalPeriod | null>(null)
  const { isAdmin } = useAuth()

  const [formData, setFormData] = useState({
    name: '',
    type: 'monthly' as PeriodType,
    startDate: '',
    endDate: ''
  })

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'monthly',
      startDate: '',
      endDate: ''
    })
  }

  const handleAdd = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newPeriod: FiscalPeriod = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      isClosed: false,
      createdAt: new Date().toISOString()
    }
    setPeriods((current) => [...(current || []), newPeriod])
    toast.success('Fiscal period created')

    setIsDialogOpen(false)
    resetForm()
  }

  const handleClosePeriod = (period: FiscalPeriod) => {
    setClosingPeriod(period)
  }

  const confirmClosePeriod = () => {
    if (!closingPeriod) return

    const draftExpenses = (expenses || []).filter(
      e => e.fiscalPeriodId === closingPeriod.id && e.status === 'draft'
    )
    const draftPayments = (payments || []).filter(
      p => p.fiscalPeriodId === closingPeriod.id && p.status === 'draft'
    )

    if (draftExpenses.length > 0 || draftPayments.length > 0) {
      toast.error(`Cannot close period: ${draftExpenses.length} draft expenses and ${draftPayments.length} draft payments must be posted first`)
      setClosingPeriod(null)
      return
    }

    setPeriods((current) =>
      (current || []).map(p =>
        p.id === closingPeriod.id
          ? { ...p, isClosed: true, closedAt: new Date().toISOString() }
          : p
      )
    )
    
    toast.success('Fiscal period closed')
    setClosingPeriod(null)
  }

  const sortedPeriods = [...(periods || [])].sort((a, b) =>
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  )

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarBlank size={24} />
                Fiscal Periods
              </CardTitle>
              <CardDescription>Manage accounting periods for financial reporting</CardDescription>
            </div>
            {isAdmin && (
              <Button onClick={handleAdd}>
                <Plus className="mr-2" size={18} />
                Create Period
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {sortedPeriods.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CalendarBlank size={48} className="mx-auto mb-4 opacity-50" />
              <p>No fiscal periods created</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPeriods.map((period) => (
                    <TableRow key={period.id}>
                      <TableCell className="font-medium">{period.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {period.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {format(new Date(period.startDate), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {format(new Date(period.endDate), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        {period.isClosed ? (
                          <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                            <LockKey size={14} />
                            Closed
                          </Badge>
                        ) : (
                          <Badge variant="default" className="flex items-center gap-1 w-fit">
                            <LockKeyOpen size={14} />
                            Open
                          </Badge>
                        )}
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          {!period.isClosed && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleClosePeriod(period)}
                            >
                              <LockKey className="mr-2" size={16} />
                              Close Period
                            </Button>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Fiscal Period</DialogTitle>
                <DialogDescription>
                  Define a new accounting period for financial tracking
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="periodName">Period Name *</Label>
                    <Input
                      id="periodName"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., January 2024, Q1 2024, FY 2024"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="periodType">Period Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: PeriodType) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger id="periodType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Period</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <AlertDialog open={!!closingPeriod} onOpenChange={() => setClosingPeriod(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Close Fiscal Period?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to close "{closingPeriod?.name}"? Once closed, no new transactions can be posted to this period, and only reversals will be allowed for posted transactions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClosePeriod}>Close Period</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
