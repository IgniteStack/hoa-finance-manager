import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { User, UserRole, OwnershipStatus, SystemConfig, Payment } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Plus, PencilSimple, Trash, MagnifyingGlass, Key, Copy, Eye, EyeSlash, Power } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { generatePassword, hashPassword } from '@/lib/password-utils'

export function NeighborManager() {
  const [neighbors, setNeighbors] = useKV<User[]>('system-users', [])
  const [payments] = useKV<Payment[]>('payments', [])
  const [systemConfig] = useKV<SystemConfig>('system-config', { isSetupComplete: false, totalHouses: 0 })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingNeighbor, setEditingNeighbor] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [neighborToDelete, setNeighborToDelete] = useState<User | null>(null)
  const { isAdmin } = useAuth()

  const houseNumbers = Array.from({ length: systemConfig?.totalHouses || 50 }, (_, i) => (i + 1).toString())

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    secondLastName: '',
    email: '',
    houseNumber: '',
    phoneNumber: '',
    phoneNumber2: '',
    ownershipStatus: 'owner' as OwnershipStatus,
    role: 'user' as UserRole,
    isActive: true
  })

  const resetForm = () => {
    setFormData({
      firstName: '',
      middleName: '',
      lastName: '',
      secondLastName: '',
      email: '',
      houseNumber: '',
      phoneNumber: '',
      phoneNumber2: '',
      ownershipStatus: 'owner',
      role: 'user',
      isActive: true
    })
    setEditingNeighbor(null)
    setGeneratedPassword('')
    setShowPassword(false)
  }

  const hasPayments = (neighborId: string): boolean => {
    return (payments || []).some(p => p.neighborId === neighborId)
  }

  const canEditAllFields = (neighbor: User): boolean => {
    return !hasPayments(neighbor.id)
  }

  const handleAdd = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const handleEdit = (neighbor: User) => {
    setEditingNeighbor(neighbor)
    setFormData({
      firstName: neighbor.firstName,
      middleName: neighbor.middleName || '',
      lastName: neighbor.lastName,
      secondLastName: neighbor.secondLastName || '',
      email: neighbor.email,
      houseNumber: neighbor.houseNumber.toString(),
      phoneNumber: neighbor.phoneNumber || '',
      phoneNumber2: neighbor.phoneNumber2 || '',
      ownershipStatus: neighbor.ownershipStatus,
      role: neighbor.role,
      isActive: neighbor.isActive
    })
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (neighbor: User) => {
    if (hasPayments(neighbor.id)) {
      toast.error('Cannot delete user', {
        description: 'This user has registered payments and cannot be deleted.'
      })
      return
    }
    setNeighborToDelete(neighbor)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (neighborToDelete) {
      setNeighbors((current) => (current || []).filter(n => n.id !== neighborToDelete.id))
      toast.success('User deleted successfully')
      setNeighborToDelete(null)
      setDeleteConfirmOpen(false)
    }
  }

  const handleResetPassword = async (user: User) => {
    const newPassword = generatePassword()
    const hashedPassword = await hashPassword(newPassword)
    
    setNeighbors((current) =>
      (current || []).map(n => 
        n.id === user.id 
          ? { ...n, password: hashedPassword, mustChangePassword: true }
          : n
      )
    )

    navigator.clipboard.writeText(newPassword)
    toast.success('New password generated and copied to clipboard', {
      description: `Password: ${newPassword}`
    })
  }

  const handleToggleStatus = (neighbor: User) => {
    setNeighbors((current) =>
      (current || []).map(n =>
        n.id === neighbor.id
          ? { ...n, isActive: !n.isActive }
          : n
      )
    )
    toast.success(`User ${neighbor.isActive ? 'deactivated' : 'activated'} successfully`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editingNeighbor) {
      const restrictedEdit = !canEditAllFields(editingNeighbor)
      
      setNeighbors((current) => 
        (current || []).map(n => n.id === editingNeighbor.id 
          ? { 
              ...n,
              ...(restrictedEdit ? {
                phoneNumber: formData.phoneNumber,
                phoneNumber2: formData.phoneNumber2,
                ownershipStatus: formData.ownershipStatus,
                isActive: formData.isActive
              } : {
                firstName: formData.firstName,
                middleName: formData.middleName || undefined,
                lastName: formData.lastName,
                secondLastName: formData.secondLastName || undefined,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                phoneNumber2: formData.phoneNumber2 || undefined,
                ownershipStatus: formData.ownershipStatus,
                role: formData.role,
                isActive: formData.isActive
              })
            }
          : n
        )
      )
      toast.success('User updated successfully')
      setIsDialogOpen(false)
      resetForm()
    } else {
      const password = generatePassword()
      const hashedPassword = await hashPassword(password)

      let nextId = 1
      const existingIds = (neighbors || [])
        .map(n => parseInt(n.id))
        .filter(id => !isNaN(id))
      
      if (existingIds.length > 0) {
        nextId = Math.max(...existingIds) + 1
      }

      const newNeighbor: User = {
        id: nextId.toString(),
        firstName: formData.firstName,
        middleName: formData.middleName || undefined,
        lastName: formData.lastName,
        secondLastName: formData.secondLastName || undefined,
        email: formData.email,
        houseNumber: parseInt(formData.houseNumber),
        phoneNumber: formData.phoneNumber,
        phoneNumber2: formData.phoneNumber2 || undefined,
        ownershipStatus: formData.ownershipStatus,
        role: formData.role,
        isActive: formData.isActive,
        balance: 0,
        password: hashedPassword,
        mustChangePassword: true,
        createdAt: new Date().toISOString()
      }
      
      setNeighbors((current) => [...(current || []), newNeighbor])
      setGeneratedPassword(password)
      setShowPassword(true)
      
      toast.success('User created successfully')
    }
  }

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(generatedPassword)
    toast.success('Password copied to clipboard')
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    resetForm()
  }

  const filteredNeighbors = (neighbors || []).filter(n => 
    searchQuery === '' ||
    `${n.firstName} ${n.middleName || ''} ${n.lastName} ${n.secondLastName || ''}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.houseNumber.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const restrictedEdit = editingNeighbor ? !canEditAllFields(editingNeighbor) : false

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage community users, accounts, and access</CardDescription>
          </div>
          {isAdmin && (
            <Button onClick={handleAdd} className="w-full sm:w-auto">
              <Plus className="mr-2" size={18} />
              Add User
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search by name, email, or house number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredNeighbors.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No users found</p>
            {isAdmin && (
              <Button variant="outline" onClick={handleAdd} className="mt-4">
                <Plus className="mr-2" size={18} />
                Add First User
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="hidden lg:block rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>House</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNeighbors.map((neighbor) => (
                    <TableRow key={neighbor.id}>
                      <TableCell className="font-mono text-sm">{neighbor.id}</TableCell>
                      <TableCell className="font-medium">
                        {`${neighbor.firstName} ${neighbor.middleName || ''} ${neighbor.lastName} ${neighbor.secondLastName || ''}`.replace(/\s+/g, ' ').trim()}
                      </TableCell>
                      <TableCell className="text-sm">{neighbor.email}</TableCell>
                      <TableCell className="font-mono">{neighbor.houseNumber}</TableCell>
                      <TableCell className="font-mono text-sm">
                        <div>{neighbor.phoneNumber}</div>
                        {neighbor.phoneNumber2 && <div className="text-xs text-muted-foreground">{neighbor.phoneNumber2}</div>}
                      </TableCell>
                      <TableCell>
                        <Badge variant={neighbor.ownershipStatus === 'owner' ? 'default' : 'secondary'}>
                          {neighbor.ownershipStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={neighbor.role === 'administration' ? 'default' : 'outline'}>
                          {neighbor.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={neighbor.isActive ? 'default' : 'destructive'}>
                          {neighbor.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEdit(neighbor)}
                              title="Edit"
                            >
                              <PencilSimple size={18} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteClick(neighbor)}
                              title="Delete"
                            >
                              <Trash size={18} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleResetPassword(neighbor)}
                              title="Reset Password"
                            >
                              <Key size={18} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleToggleStatus(neighbor)}
                              title="Change Status"
                            >
                              <Power size={18} />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="lg:hidden space-y-3">
              {filteredNeighbors.map((neighbor) => (
                <Card key={neighbor.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="font-mono text-xs text-muted-foreground mb-1">ID: {neighbor.id}</div>
                        <div className="font-medium text-base">
                          {`${neighbor.firstName} ${neighbor.middleName || ''} ${neighbor.lastName} ${neighbor.secondLastName || ''}`.replace(/\s+/g, ' ').trim()}
                        </div>
                        <div className="text-sm text-muted-foreground">{neighbor.email}</div>
                        <div className="text-sm text-muted-foreground font-mono">House {neighbor.houseNumber}</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge variant={neighbor.role === 'administration' ? 'default' : 'outline'} className="text-xs">
                          {neighbor.role}
                        </Badge>
                        <Badge variant={neighbor.ownershipStatus === 'owner' ? 'default' : 'secondary'} className="text-xs">
                          {neighbor.ownershipStatus}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <Badge variant={neighbor.isActive ? 'default' : 'destructive'} className="text-xs">
                        {neighbor.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground font-mono mb-3">
                      <div>{neighbor.phoneNumber}</div>
                      {neighbor.phoneNumber2 && <div>{neighbor.phoneNumber2}</div>}
                    </div>
                    {isAdmin && (
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(neighbor)}>
                          <PencilSimple size={16} className="mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteClick(neighbor)}>
                          <Trash size={16} className="mr-1" />
                          Delete
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleResetPassword(neighbor)}>
                          <Key size={16} className="mr-1" />
                          Reset Password
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleToggleStatus(neighbor)}>
                          <Power size={16} className="mr-1" />
                          {neighbor.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingNeighbor ? 'Edit User' : 'Add User'}</DialogTitle>
              <DialogDescription>
                {editingNeighbor ? 'Update user information' : 'Add a new user to the community'}
              </DialogDescription>
            </DialogHeader>
            
            {restrictedEdit && (
              <Alert className="bg-accent/10 border-accent">
                <AlertDescription className="text-sm">
                  This user has registered payments. Only Phone Numbers, Ownership Status, and Active Status can be edited.
                </AlertDescription>
              </Alert>
            )}

            {!generatedPassword || editingNeighbor ? (
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                        disabled={restrictedEdit}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="middleName">Middle Name</Label>
                      <Input
                        id="middleName"
                        value={formData.middleName}
                        onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                        disabled={restrictedEdit}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                        disabled={restrictedEdit}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondLastName">Second Last Name</Label>
                      <Input
                        id="secondLastName"
                        value={formData.secondLastName}
                        onChange={(e) => setFormData({ ...formData, secondLastName: e.target.value })}
                        disabled={restrictedEdit}
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
                      disabled={restrictedEdit}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="houseNumber">House Number *</Label>
                      <Select
                        value={formData.houseNumber}
                        onValueChange={(value) => setFormData({ ...formData, houseNumber: value })}
                        required
                        disabled={!!editingNeighbor}
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
                      {editingNeighbor && (
                        <p className="text-xs text-muted-foreground">House number cannot be changed</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number 1 *</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber2">Phone Number 2</Label>
                      <Input
                        id="phoneNumber2"
                        type="tel"
                        value={formData.phoneNumber2}
                        onChange={(e) => setFormData({ ...formData, phoneNumber2: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ownershipStatus">Owner or Tenant *</Label>
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
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="role">Role *</Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
                        disabled={restrictedEdit}
                      >
                        <SelectTrigger id="role">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="administration">Administration</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="auditor">Auditor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2 pt-8">
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                      />
                      <Label htmlFor="isActive">Active</Label>
                    </div>
                  </div>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <Button type="button" variant="outline" onClick={handleCloseDialog} className="w-full sm:w-auto">
                    Cancel
                  </Button>
                  <Button type="submit" className="w-full sm:w-auto">
                    {editingNeighbor ? 'Update' : 'Add'} User
                  </Button>
                </DialogFooter>
              </form>
            ) : (
              <div className="space-y-4">
                <Alert className="bg-accent/10 border-accent">
                  <AlertDescription>
                    <div className="space-y-3">
                      <p className="font-medium">User created successfully!</p>
                      <p className="text-sm">
                        The user will be required to change this password on first login.
                      </p>
                      <div className="bg-background border rounded-md p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Generated Password</Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            value={generatedPassword}
                            readOnly
                            className="font-mono"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={handleCopyPassword}
                          >
                            <Copy size={16} />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Make sure to copy this password and send it to the user securely.
                        You won't be able to see it again.
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>

                <DialogFooter>
                  <Button onClick={handleCloseDialog} className="w-full">
                    Done
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete User?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this user? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}
