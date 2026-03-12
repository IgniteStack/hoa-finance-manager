import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { User, UserRole } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Trash, Key, Copy, Eye, EyeSlash } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { generatePassword, hashPassword } from '@/lib/password-utils'

export function UserManager() {
  const [users, setUsers] = useKV<User[]>('system-users', [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'neighbor' as UserRole,
    phoneNumber: ''
  })

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      role: 'neighbor',
      phoneNumber: ''
    })
    setGeneratedPassword('')
    setShowPassword(false)
  }

  const handleAdd = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setUsers((current) => (current || []).filter(u => u.id !== id))
    toast.success('User deleted successfully')
  }

  const handleResetPassword = async (user: User) => {
    const newPassword = generatePassword()
    const hashedPassword = await hashPassword(newPassword)
    
    setUsers((current) =>
      (current || []).map(u => 
        u.id === user.id 
          ? { ...u, password: hashedPassword, mustChangePassword: true }
          : u
      )
    )

    navigator.clipboard.writeText(newPassword)
    toast.success('New password generated and copied to clipboard', {
      description: `Password: ${newPassword}`
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const password = generatePassword()
    const hashedPassword = await hashPassword(password)

    const newUser: User = {
      id: Date.now().toString(),
      ...formData,
      password: hashedPassword,
      mustChangePassword: true,
      createdAt: new Date().toISOString()
    }
    
    setUsers((current) => [...(current || []), newUser])
    setGeneratedPassword(password)
    setShowPassword(true)
    
    toast.success('User created successfully')
  }

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(generatedPassword)
    toast.success('Password copied to clipboard')
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    resetForm()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">User Accounts</h2>
          <p className="text-muted-foreground">Manage user accounts and passwords</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus size={18} />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            {(users || []).length} user account{(users || []).length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(users || []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No users found. Add your first user to get started.
                  </TableCell>
                </TableRow>
              ) : (
                (users || []).map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.mustChangePassword ? (
                        <Badge variant="outline" className="bg-accent/10">
                          Must change password
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-secondary">
                          Active
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResetPassword(user)}
                          className="gap-2"
                        >
                          <Key size={16} />
                          Reset Password
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                          className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account with an auto-generated password
            </DialogDescription>
          </DialogHeader>
          
          {!generatedPassword ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="neighbor">Neighbor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit">Create User</Button>
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
    </div>
  )
}
