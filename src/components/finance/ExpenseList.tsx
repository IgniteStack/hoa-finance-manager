import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Expense } from '@/lib/types'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, PencilSimple, Trash } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { format } from 'date-fns'

export function ExpenseList() {
  const [expenses, setExpenses] = useKV<Expense[]>('expenses', [])
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
    setExpenses((current) => (current || []).filter(e => e.id !== id))
    toast.success('Expense deleted')
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
                {isAdmin && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedExpenses.map((expense) => (
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
                  {isAdmin && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(expense)}>
                          <PencilSimple size={18} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(expense.id)}>
                          <Trash size={18} />
                        </Button>
                      </div>
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