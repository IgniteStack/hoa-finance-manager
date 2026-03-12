import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { User } from '@/lib/types'
import { hashPassword } from '@/lib/password-utils'
import { toast } from 'sonner'
import { ArrowLeft, CheckCircle } from '@phosphor-icons/react'

interface ForgotPasswordDialogProps {
  open: boolean
  onClose: () => void
}

type Step = 'email' | 'security' | 'password' | 'success'

export function ForgotPasswordDialog({ open, onClose }: ForgotPasswordDialogProps) {
  const [users, setUsers] = useKV<User[]>('users', [])
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [securityAnswer, setSecurityAnswer] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [foundUser, setFoundUser] = useState<User | null>(null)

  const handleClose = () => {
    setStep('email')
    setEmail('')
    setSecurityAnswer('')
    setNewPassword('')
    setConfirmPassword('')
    setError('')
    setFoundUser(null)
    onClose()
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!users) {
      setError('System error. Please try again.')
      return
    }

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!user) {
      setError('No account found with this email address.')
      return
    }

    if (!user.securityQuestion || !user.securityAnswer) {
      setError('This account does not have a security question set up. Please contact an administrator.')
      return
    }

    setFoundUser(user)
    setStep('security')
  }

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!foundUser || !foundUser.securityAnswer) {
      return
    }

    if (securityAnswer.toLowerCase().trim() !== foundUser.securityAnswer.toLowerCase().trim()) {
      setError('Incorrect answer. Please try again.')
      return
    }

    setStep('password')
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    if (!foundUser) {
      return
    }

    const hashedPassword = await hashPassword(newPassword)
    setUsers((currentUsers) => {
      if (!currentUsers) return []
      return currentUsers.map(u =>
        u.id === foundUser.id
          ? { ...u, password: hashedPassword, mustChangePassword: false }
          : u
      )
    })

    toast.success('Password reset successfully!')
    setStep('success')
  }

  const handleBackToEmail = () => {
    setSecurityAnswer('')
    setError('')
    setStep('email')
  }

  const handleBackToSecurity = () => {
    setNewPassword('')
    setConfirmPassword('')
    setError('')
    setStep('security')
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {step === 'email' && 'Reset Password'}
            {step === 'security' && 'Security Verification'}
            {step === 'password' && 'Set New Password'}
            {step === 'success' && 'Password Reset Complete'}
          </DialogTitle>
        </DialogHeader>

        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                autoFocus
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Continue
              </Button>
            </div>
          </form>
        )}

        {step === 'security' && foundUser && (
          <form onSubmit={handleSecuritySubmit} className="space-y-4">
            <div className="p-3 rounded-lg bg-muted/50 border">
              <p className="text-sm font-medium mb-1">Security Question:</p>
              <p className="text-sm text-muted-foreground">{foundUser.securityQuestion}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="security-answer">Your Answer</Label>
              <Input
                id="security-answer"
                type="text"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                placeholder="Enter your answer"
                required
                autoComplete="off"
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                Answer is not case-sensitive
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleBackToEmail} className="gap-2">
                <ArrowLeft size={16} />
                Back
              </Button>
              <Button type="submit" className="flex-1">
                Verify
              </Button>
            </div>
          </form>
        )}

        {step === 'password' && (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
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

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleBackToSecurity} className="gap-2">
                <ArrowLeft size={16} />
                Back
              </Button>
              <Button type="submit" className="flex-1">
                Reset Password
              </Button>
            </div>
          </form>
        )}

        {step === 'success' && (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="bg-accent/20 text-accent p-4 rounded-full mb-4">
                <CheckCircle size={48} weight="fill" />
              </div>
              <p className="text-sm text-muted-foreground">
                Your password has been reset successfully. You can now close this dialog and sign in with your new password.
              </p>
            </div>

            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
