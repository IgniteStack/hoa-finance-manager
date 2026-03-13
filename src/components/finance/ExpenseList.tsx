import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Expense, FiscalPeriod } from '@/lib/types'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, PencilSimple, Trash, CheckCircle, ArrowCounterClockwise } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { format } from 'date-fns'

export function ExpenseList() {
  const [expenses, setExpenses] = useKV<Expense[]>('expenses', [])
  const [fiscalPeriods] = useKV<FiscalPeriod[]>('fiscal-periods', [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const { isAdmin } = useAuth()

  const [formData, setFormData] = useState({
    concept: '',
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    notes: ''
  })

  const resetForm = () => {
    setFormData({
      concept: '',
      amount: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      notes: ''
    })
    setEditingExpense(null)
  }

  const handleAdd = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const handleEdit = (expense: Expense) => {
    if (expense.status === 'active') {
      toast.error('Posted expenses cannot be edited. Unpost the expense first.')
      return
    }
    setEditingExpense(expense)
    setFormData({
      concept: expense.concept,
      amount: expense.amount.toString(),
      date: expense.date,
      notes: expense.notes || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    const expense = (expenses || []).find(e => e.id === id)
    if (expense?.status === 'active') {
      toast.error('Posted expenses cannot be deleted. Unpost the expense first.')
      return
    }
    setExpenses((current) => (current || []).filter(e => e.id !== id))
    toast.success('Expense deleted')
  }

  const handlePost = (expense: Expense) => {
    setExpenses((current) =>
      (current || []).map(e =>
        e.id === expense.id
          ? { ...e, status: 'active', postedAt: new Date().toISOString() }
          : e
      )
    )
    toast.success('Expense posted')
  }

  const handleUnpost = (expense: Expense) => {
    if (expense.fiscalPeriodId) {
      const period = (fiscalPeriods || []).find(fp => fp.id === expense.fiscalPeriodId)
      if (period?.isClosed) {
        toast.error('Cannot unpost: the fiscal period is closed.')
        return
      }
    }
    setExpenses((current) =>
      (current || []).map(e =>
        e.id === expense.id
          ? { ...e, status: 'draft', postedAt: undefined }
          : e
      )
    )
    toast.success('Expense unposted')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingExpense) {
      setExpenses((current) => 
        (current || []).map(exp => exp.id === editingExpense.id 
          ? { ...editingExpense, ...formData, amount: parseFloat(formData.amount) }
          : exp
        )
      )
      toast.success('Expense updated')
    } else {
      const newExpense: Expense = {
        id: Date.now().toString(),
        concept: formData.concept,
        amount: parseFloat(formData.amount),
        date: formData.date,
        notes: formData.notes,
        status: 'draft',
        createdAt: new Date().toISOString()
      }
      setExpenses((current) => [...(current || []), newExpense])
      toast.success('Expense added')
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const sortedExpenses = [...(expenses || [])].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Expense Registry</h3>
        {isAdmin && (
          <Button onClick={handleAdd}>
            <Plus className="mr-2" size={18} />
            Add Expense
          </Button>
        )}
      </div>

      {sortedExpenses.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No expenses recorded</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Concept</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Status</TableHead>
                {isAdmin && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedExpenses.map((expense) => {
                const isPosted = expense.status === 'active'
                return (
                  <TableRow key={expense.id}>
                    <TableCell className="font-mono text-sm">
                      {format(new Date(expense.date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="font-medium">{expense.concept}</TableCell>
                    <TableCell className="font-mono font-bold text-destructive">
                      ${expense.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {expense.notes || '-'}
                    </TableCell>
                    <TableCell>
                      {expense.status === 'active' && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Posted</Badge>
                      )}
                      {expense.status === 'draft' && (
                        <Badge variant="outline" className="text-muted-foreground">Draft</Badge>
                      )}
                      {expense.status === 'reversed' && (
                        <Badge variant="destructive">Reversed</Badge>
                      )}
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {!isPosted && (
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Post expense"
                              onClick={() => handlePost(expense)}
                            >
                              <CheckCircle size={18} />
                            </Button>
                          )}
                          {isPosted && (
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Unpost expense"
                              onClick={() => handleUnpost(expense)}
                            >
                              <ArrowCounterClockwise size={18} />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            title={isPosted ? 'Posted expenses cannot be edited' : 'Edit expense'}
                            disabled={isPosted}
                            onClick={() => handleEdit(expense)}
                          >
                            <PencilSimple size={18} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title={isPosted ? 'Posted expenses cannot be deleted' : 'Delete expense'}
                            disabled={isPosted}
                            onClick={() => handleDelete(expense.id)}
                          >
                            <Trash size={18} />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingExpense ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
            <DialogDescription>
              {editingExpense ? 'Update expense details' : 'Record a new community expense'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="concept">Concept *</Label>
                <Input
                  id="concept"
                  value={formData.concept}
                  onChange={(e) => setFormData({ ...formData, concept: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingExpense ? 'Update' : 'Add'} Expense
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}