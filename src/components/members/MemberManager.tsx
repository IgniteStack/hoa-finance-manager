import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { User, UserRole, OwnershipStatus, SystemConfig } from '@/lib/types'
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
import { SecurityQuestionDialog } from '@/components/SecurityQuestionDialog'
import { MemberProfile } from '@/components/members/MemberProfile'
import { Plus, PencilSimple, Trash, MagnifyingGlass, Key, Copy, Eye, EyeSlash, ShieldCheck, ShieldWarning, UserCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { generatePassword, hashPassword } from '@/lib/password-utils'

export function MemberManager() {
  const [members, setMembers] = useKV<User[]>('system-users', [])
  const [systemConfig] = useKV<SystemConfig>('system-config', { isSetupComplete: false, totalHouses: 0 })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [showSecurityDialog, setShowSecurityDialog] = useState(false)
  const [viewingMemberId, setViewingMemberId] = useState<string | null>(null)
  const { isAdmin } = useAuth()

  const houseNumbers = Array.from({ length: systemConfig?.totalHouses || 50 }, (_, i) => (i + 1).toString())

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    houseNumber: '',
    phoneNumber: '',
    ownershipStatus: 'owner' as OwnershipStatus,
    role: 'user' as UserRole,
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
      role: 'user',
      isActive: true,
      balance: 0
    })
    setEditingMember(null)
    setGeneratedPassword('')
    setShowPassword(false)
  }

  const handleAdd = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const handleEdit = (member: User) => {
    setEditingMember(member)
    setFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      houseNumber: member.houseNumber.toString(),
      phoneNumber: member.phoneNumber || '',
      ownershipStatus: member.ownershipStatus,
      role: member.role,
      isActive: member.isActive,
      balance: member.balance
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setMembers((current) => (current || []).filter(m => m.id !== id))
    toast.success('Member deleted successfully')
  }

  const handleResetPassword = async (user: User) => {
    const newPassword = generatePassword()
    const hashedPassword = await hashPassword(newPassword)
    
    setMembers((current) =>
      (current || []).map(m => 
        m.id === user.id 
          ? { ...m, password: hashedPassword, mustChangePassword: true }
          : m
      )
    )

    navigator.clipboard.writeText(newPassword)
    toast.success('New password generated and copied to clipboard', {
      description: `Password: ${newPassword}`
    })
  }

  const handleSetupSecurity = (userId: string) => {
    setSelectedUserId(userId)
    setShowSecurityDialog(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editingMember) {
      setMembers((current) => 
        (current || []).map(m => m.id === editingMember.id 
          ? { 
              ...editingMember, 
              ...formData, 
              houseNumber: parseInt(formData.houseNumber),
              password: editingMember.password
            }
          : m
        )
      )
      toast.success('Member updated successfully')
      setIsDialogOpen(false)
      resetForm()
    } else {
      const password = generatePassword()
      const hashedPassword = await hashPassword(password)

      const newMember: User = {
        id: Date.now().toString(),
        ...formData,
        houseNumber: parseInt(formData.houseNumber),
        password: hashedPassword,
        mustChangePassword: true,
        createdAt: new Date().toISOString()
      }
      
      setMembers((current) => [...(current || []), newMember])
      setGeneratedPassword(password)
      setShowPassword(true)
      
      toast.success('Member created successfully')
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

  const filteredMembers = (members || []).filter(m => 
    searchQuery === '' ||
    `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.houseNumber.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (viewingMemberId) {
    return (
      <MemberProfile 
        memberId={viewingMemberId} 
        onBack={() => setViewingMemberId(null)} 
      />
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Members</CardTitle>
            <CardDescription>Manage community members, accounts, and access</CardDescription>
          </div>
          {isAdmin && (
            <Button onClick={handleAdd} className="w-full sm:w-auto">
              <Plus className="mr-2" size={18} />
              Add Member
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

        {filteredMembers.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No members found</p>
            {isAdmin && (
              <Button variant="outline" onClick={handleAdd} className="mt-4">
                <Plus className="mr-2" size={18} />
                Add First Member
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="hidden md:block rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>House</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Security</TableHead>
                    {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        {`${member.firstName} ${member.lastName}`.trim()}
                      </TableCell>
                      <TableCell className="text-sm">{member.email}</TableCell>
                      <TableCell className="font-mono">{member.houseNumber}</TableCell>
                      <TableCell className="font-mono text-sm">{member.phoneNumber}</TableCell>
                      <TableCell>
                        <Badge variant={member.ownershipStatus === 'owner' ? 'default' : 'secondary'}>
                          {member.ownershipStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={member.role === 'administration' ? 'default' : 'outline'}>
                          {member.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={member.isActive ? 'default' : 'destructive'}>
                          {member.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {member.securityQuestion ? (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <ShieldCheck size={14} weight="fill" className="text-accent" />
                            Set
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <ShieldWarning size={14} weight="fill" className="text-destructive" />
                            Not set
                          </div>
                        )}
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setViewingMemberId(member.id)}>
                              <UserCircle size={18} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(member)}>
                              <PencilSimple size={18} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleSetupSecurity(member.id)}>
                              <ShieldCheck size={18} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleResetPassword(member)}>
                              <Key size={18} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(member.id)}>
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

            <div className="md:hidden space-y-3">
              {filteredMembers.map((member) => (
                <Card key={member.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-medium text-base">
                          {`${member.firstName} ${member.lastName}`.trim()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {member.email}
                        </div>
                        <div className="text-sm text-muted-foreground font-mono">
                          House {member.houseNumber}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge variant={member.role === 'administration' ? 'default' : 'outline'} className="text-xs">
                          {member.role}
                        </Badge>
                        <Badge variant={member.ownershipStatus === 'owner' ? 'default' : 'secondary'} className="text-xs">
                          {member.ownershipStatus}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <Badge variant={member.isActive ? 'default' : 'destructive'} className="text-xs">
                        {member.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      {member.securityQuestion ? (
                        <Badge variant="outline" className="text-xs gap-1">
                          <ShieldCheck size={12} weight="fill" className="text-accent" />
                          Secured
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs gap-1">
                          <ShieldWarning size={12} weight="fill" className="text-destructive" />
                          No Security
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground font-mono mb-3">
                      {member.phoneNumber}
                    </div>
                    {isAdmin && (
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" onClick={() => setViewingMemberId(member.id)} className="col-span-2">
                          <UserCircle size={16} className="mr-1" />
                          View Profile
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(member)}>
                          <PencilSimple size={16} className="mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleSetupSecurity(member.id)}>
                          <ShieldCheck size={16} className="mr-1" />
                          Security
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleResetPassword(member)}>
                          <Key size={16} className="mr-1" />
                          Reset
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(member.id)}>
                          <Trash size={16} className="mr-1" />
                          Delete
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingMember ? 'Edit Member' : 'Add Member'}</DialogTitle>
              <DialogDescription>
                {editingMember ? 'Update member information' : 'Add a new member to the community'}
              </DialogDescription>
            </DialogHeader>
            
            {!generatedPassword || editingMember ? (
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
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
                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <Button type="button" variant="outline" onClick={handleCloseDialog} className="w-full sm:w-auto">
                    Cancel
                  </Button>
                  <Button type="submit" className="w-full sm:w-auto">
                    {editingMember ? 'Update' : 'Add'} Member
                  </Button>
                </DialogFooter>
              </form>
            ) : (
              <div className="space-y-4">
                <Alert className="bg-accent/10 border-accent">
                  <AlertDescription>
                    <div className="space-y-3">
                      <p className="font-medium">Member created successfully!</p>
                      <p className="text-sm">
                        The member will be required to change this password on first login.
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
                        Make sure to copy this password and send it to the member securely.
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

        {selectedUserId && (
          <SecurityQuestionDialog
            open={showSecurityDialog}
            onClose={() => {
              setShowSecurityDialog(false)
              setSelectedUserId(null)
            }}
            userId={selectedUserId}
          />
        )}
      </CardContent>
    </Card>
  )
}
