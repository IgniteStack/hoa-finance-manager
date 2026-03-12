import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Payment, Neighbor } from '@/lib/types'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, PencilSimple, Trash } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface PaymentListProps {
  neighbors: Neighbor[]
}

export function PaymentList({ neighbors }: PaymentListProps) {
  const [payments, setPayments] = useKV<Payment[]>('payments', [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null)
  const { isAdmin } = useAuth()

  const [formData, setFormData] = useState({
    concept: '',
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    neighborId: '',
    bankAccount: ''
  })

  const resetForm = () => {
    setFormData({
      concept: '',
      amount: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      neighborId: '',
      bankAccount: ''
    })
    setEditingPayment(null)
  }

  const handleAdd = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment)
    setFormData({
      concept: payment.concept,
      amount: payment.amount.toString(),
      date: payment.date,
      neighborId: payment.neighborId,
      bankAccount: payment.bankAccount || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setPayments((current) => (current || []).filter(p => p.id !== id))
    toast.success('Payment deleted')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const neighbor = neighbors.find(n => n.id === formData.neighborId)
    if (!neighbor) return

    if (editingPayment) {
      setPayments((current) => 
        (current || []).map(pay => pay.id === editingPayment.id 
          ? { 
              ...editingPayment, 
              concept: formData.concept,
              amount: parseFloat(formData.amount),
              date: formData.date,
              neighborId: formData.neighborId,
              houseNumber: neighbor.houseNumber,
              bankAccount: formData.bankAccount
            }
          : pay
        )
      )
      toast.success('Payment updated')
    } else {
      const newPayment: Payment = {
        id: Date.now().toString(),
        concept: formData.concept,
        amount: parseFloat(formData.amount),
        date: formData.date,
        neighborId: formData.neighborId,
        houseNumber: neighbor.houseNumber,
        bankAccount: formData.bankAccount,
        createdAt: new Date().toISOString()
      }
      setPayments((current) => [...(current || []), newPayment])
      toast.success('Payment recorded')
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const sortedPayments = [...(payments || [])].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Payment Registry</h3>
        {isAdmin && (
          <Button onClick={handleAdd}>
            <Plus className="mr-2" size={18} />
            Record Payment
          </Button>
        )}
      </div>

      {sortedPayments.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No payments recorded</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Neighbor</TableHead>
                <TableHead>House</TableHead>
                <TableHead>Concept</TableHead>
                <TableHead>Amount</TableHead>
                {isAdmin && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPayments.map((payment) => {
                const neighbor = neighbors.find(n => n.id === payment.neighborId)
                return (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-sm">
                      {format(new Date(payment.date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="font-medium">
                      {neighbor ? `${neighbor.firstName} ${neighbor.lastName}` : 'Unknown'}
                    </TableCell>
                    <TableCell className="font-mono">{payment.houseNumber}</TableCell>
                    <TableCell>{payment.concept}</TableCell>
                    <TableCell className="font-mono font-bold text-accent">
                      ${payment.amount.toFixed(2)}
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(payment)}>
                            <PencilSimple size={18} />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(payment.id)}>
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
            <DialogTitle>{editingPayment ? 'Edit Payment' : 'Record Payment'}</DialogTitle>
            <DialogDescription>
              {editingPayment ? 'Update payment details' : 'Register a new payment from a neighbor'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="neighbor">Neighbor *</Label>
                <Select
                  value={formData.neighborId}
                  onValueChange={(value) => setFormData({ ...formData, neighborId: value })}
                  required
                >
                  <SelectTrigger id="neighbor">
                    <SelectValue placeholder="Select neighbor" />
                  </SelectTrigger>
                  <SelectContent>
                    {neighbors.map((neighbor) => (
                      <SelectItem key={neighbor.id} value={neighbor.id}>
                        {neighbor.firstName} {neighbor.lastName} - House {neighbor.houseNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="concept">Concept *</Label>
                <Input
                  id="concept"
                  value={formData.concept}
                  onChange={(e) => setFormData({ ...formData, concept: e.target.value })}
                  placeholder="e.g., Monthly dues, Special assessment"
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
                <Label htmlFor="bankAccount">Bank Account (optional)</Label>
                <Input
                  id="bankAccount"
                  value={formData.bankAccount}
                  onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                  placeholder="Account number or reference"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingPayment ? 'Update' : 'Record'} Payment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}