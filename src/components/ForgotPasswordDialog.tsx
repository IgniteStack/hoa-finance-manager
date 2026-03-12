import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { User } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { hashPassword } from '@/lib/password-utils'
import { ArrowLeft, CheckCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface ForgotPasswordDialogProps {
  open: boolean
  onClose: () => void
}

type Step = 'email' | 'security' | 'password' | 'success'

export function ForgotPasswordDialog({ open, onClose }: ForgotPasswordDialogProps) {
  const [users, setUsers] = useKV<User[]>('system-users', [])
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [foundUser, setFoundUser] = useState<User | null>(null)
  const [securityAnswer, setSecurityAnswer] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleClose = () => {
    setStep('email')
    setEmail('')
    setFoundUser(null)
    setSecurityAnswer('')
    setNewPassword('')
    setConfirmPassword('')
    setError('')
    onClose()
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const user = (users || []).find(u => u.email.toLowerCase() === email.toLowerCase())
    
    if (!user) {
      setError('No account found with this email address')
      return
    }

    if (!user.securityQuestion || !user.securityAnswer) {
      setError('This account does not have a security question set up')
      return
    }

    setFoundUser(user)
    setStep('security')
  }

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!foundUser) return

    const hashedAnswer = await hashPassword(securityAnswer.toLowerCase().trim())
    
    if (hashedAnswer !== foundUser.securityAnswer) {
      setError('Incorrect answer to security question')
      return
    }

    setStep('password')
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
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

    if (!foundUser) return

    const hashedPassword = await hashPassword(newPassword)
    
    setUsers((current) =>
      (current || []).map(u =>
        u.id === foundUser.id
          ? { ...u, password: hashedPassword }
          : u
      )
    )

    toast.success('Password reset successfully')
    setStep('success')
  }

  const handleBackToEmail = () => {
    setStep('email')
    setFoundUser(null)
    setSecurityAnswer('')
    setError('')
  }

  const handleBackToSecurity = () => {
    setStep('security')
    setNewPassword('')
    setConfirmPassword('')
    setError('')
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'email' && 'Reset Password'}
            {step === 'security' && 'Verify Your Identity'}
            {step === 'password' && 'Create New Password'}
            {step === 'success' && 'Password Reset Complete'}
          </DialogTitle>
          <DialogDescription>
            {step === 'email' && 'Enter your email address to begin password recovery'}
            {step === 'security' && 'Answer your security question to verify your identity'}
            {step === 'password' && 'Choose a new password for your account'}
            {step === 'success' && 'You can now sign in with your new password'}
          </DialogDescription>
        </DialogHeader>

        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email Address</Label>
              <Input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                autoFocus
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">
                Continue
              </Button>
            </div>
          </form>
        )}

        {step === 'security' && foundUser && (
          <form onSubmit={handleSecuritySubmit} className="space-y-4">
            <Alert className="bg-accent/10 border-accent">
              <AlertDescription className="text-sm font-medium">
                {foundUser.securityQuestion}
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="security-answer">Your Answer</Label>
              <Input
                id="security-answer"
                type="text"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                placeholder="Enter your answer"
                required
                autoFocus
                autoComplete="off"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={handleBackToEmail}>
                <ArrowLeft size={16} className="mr-1" />
                Back
              </Button>
              <Button type="submit">
                Continue
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

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={handleBackToSecurity}>
                <ArrowLeft size={16} className="mr-1" />
                Back
              </Button>
              <Button type="submit">
                Reset Password
              </Button>
            </div>
          </form>
        )}

        {step === 'success' && (
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="bg-accent/10 p-4 rounded-full">
                <CheckCircle size={48} className="text-accent" weight="fill" />
              </div>
              <p className="text-sm text-muted-foreground">
                Your password has been successfully reset. You can now sign in with your new password.
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
