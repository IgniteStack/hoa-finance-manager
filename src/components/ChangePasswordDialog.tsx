import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { User } from '@/lib/types'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Lock } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { hashPassword } from '@/lib/password-utils'

interface ChangePasswordDialogProps {
  open: boolean
  onClose: () => void
}

export function ChangePasswordDialog({ open, onClose }: ChangePasswordDialogProps) {
  const { user, updatePassword } = useAuth()
  const [users, setUsers] = useKV<User[]>('system-users', [])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!user) return

    const hashedPassword = await hashPassword(newPassword)
    
    setUsers((current) =>
      (current || []).map(u => 
        u.id === user.id 
          ? { ...u, password: hashedPassword, mustChangePassword: false }
          : u
      )
    )

    updatePassword(newPassword)
    toast.success('Password changed successfully')
    setNewPassword('')
    setConfirmPassword('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock size={20} />
            Change Password
          </DialogTitle>
          <DialogDescription>
            You must change your password before continuing
          </DialogDescription>
        </DialogHeader>

        <Alert className="bg-accent/10 border-accent">
          <AlertDescription className="text-sm">
            Please choose a strong password with at least 8 characters.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full">
            Change Password
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
