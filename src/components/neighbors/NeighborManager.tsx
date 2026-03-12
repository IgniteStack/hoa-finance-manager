import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Neighbor, OwnershipStatus, SystemConfig } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, PencilSimple, Trash, MagnifyingGlass } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'

export function NeighborManager() {
  const [neighbors, setNeighbors] = useKV<Neighbor[]>('neighbors', [])
  const [systemConfig] = useKV<SystemConfig>('system-config', { isSetupComplete: false, totalHouses: 0 })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingNeighbor, setEditingNeighbor] = useState<Neighbor | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { isAdmin } = useAuth()

  const houseNumbers = Array.from({ length: systemConfig?.totalHouses || 50 }, (_, i) => (i + 1).toString())

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    houseNumber: '',
    phoneNumber: '',
    ownershipStatus: 'owner' as OwnershipStatus,
    isActive: true,
    balance: 0
  })

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      houseNumber: '',
      phoneNumber: '',
      ownershipStatus: 'owner',
      isActive: true,
      balance: 0
    })
    setEditingNeighbor(null)
  }

  const handleAdd = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const handleEdit = (neighbor: Neighbor) => {
    setEditingNeighbor(neighbor)
    setFormData({
      firstName: neighbor.firstName,
      lastName: neighbor.lastName,
      email: neighbor.email,
      houseNumber: neighbor.houseNumber,
      phoneNumber: neighbor.phoneNumber,
      ownershipStatus: neighbor.ownershipStatus,
      isActive: neighbor.isActive,
      balance: neighbor.balance
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setNeighbors((current) => (current || []).filter(n => n.id !== id))
    toast.success('Neighbor deleted successfully')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingNeighbor) {
      setNeighbors((current) => 
        (current || []).map(n => n.id === editingNeighbor.id 
          ? { ...editingNeighbor, ...formData }
          : n
        )
      )
      toast.success('Neighbor updated successfully')
    } else {
      const newNeighbor: Neighbor = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString()
      }
      setNeighbors((current) => [...(current || []), newNeighbor])
      toast.success('Neighbor added successfully')
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const filteredNeighbors = (neighbors || []).filter(n => 
    searchQuery === '' ||
    `${n.firstName} ${n.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.houseNumber.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Neighbors</CardTitle>
            <CardDescription>Manage community residents and their information</CardDescription>
          </div>
          {isAdmin && (
            <Button onClick={handleAdd}>
              <Plus className="mr-2" size={18} />
              Add Neighbor
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search by name or house number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredNeighbors.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No neighbors found</p>
            {isAdmin && (
              <Button variant="outline" onClick={handleAdd} className="mt-4">
                <Plus className="mr-2" size={18} />
                Add First Neighbor
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>House</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Ownership</TableHead>
                  <TableHead>Status</TableHead>
                  {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNeighbors.map((neighbor) => (
                  <TableRow key={neighbor.id}>
                    <TableCell className="font-medium">
                      {`${neighbor.firstName} ${neighbor.lastName}`.trim()}
                    </TableCell>
                    <TableCell className="font-mono">{neighbor.houseNumber}</TableCell>
                    <TableCell className="font-mono text-sm">{neighbor.phoneNumber}</TableCell>
                    <TableCell>
                      <Badge variant={neighbor.ownershipStatus === 'owner' ? 'default' : 'secondary'}>
                        {neighbor.ownershipStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={neighbor.isActive ? 'default' : 'destructive'}>
                        {neighbor.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(neighbor)}>
                            <PencilSimple size={18} />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(neighbor.id)}>
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingNeighbor ? 'Edit Neighbor' : 'Add Neighbor'}</DialogTitle>
              <DialogDescription>
                {editingNeighbor ? 'Update neighbor information' : 'Add a new resident to the community'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="houseNumber">House Number *</Label>
                    <Select
                      value={formData.houseNumber}
                      onValueChange={(value) => setFormData({ ...formData, houseNumber: value })}
                      required
                    >
                      <SelectTrigger id="houseNumber">
                        <SelectValue placeholder="Select house number" />
                      </SelectTrigger>
                      <SelectContent>
                        {houseNumbers.map((num) => (
                          <SelectItem key={num} value={num}>
                            House {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownershipStatus">Ownership Status</Label>
                  <Select
                    value={formData.ownershipStatus}
                    onValueChange={(value: OwnershipStatus) => setFormData({ ...formData, ownershipStatus: value })}
                  >
                    <SelectTrigger id="ownershipStatus">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="tenant">Tenant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingNeighbor ? 'Update' : 'Add'} Neighbor
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}