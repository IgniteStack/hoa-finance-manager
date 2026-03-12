import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User } from '@/lib/types'
import { hashPassword } from '@/lib/password-utils'
import { toast } from 'sonner'
import { ArrowLeft, CheckCircle } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'

type Step = 'email' | 'security' | 'password' | 'success'

interface ForgotPasswordDialogProps {
  open: boolean
  onClose: () => void
}

export function ForgotPasswordDialog({ open, onClose }: ForgotPasswordDialogProps) {
  const [users, setUsers] = useKV<User[]>('users', [])
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [foundUser, setFoundUser] = useState<User | null>(null)
  const [securityAnswer, setSecurityAnswer] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleClose = () => {
    setStep('email')
    setEmail('')
    setFoundUser(null)
    setSecurityAnswer('')
    setNewPassword('')
    setConfirmPassword('')
    onClose()
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const user = (users || []).find(u => u.email.toLowerCase() === email.toLowerCase())
    
    if (!user) {
      toast.error('Email not found in the system')
      return
    }

    if (!user.securityQuestion || !user.securityAnswer) {
      toast.error('This account has no security question set up. Please contact an administrator.')
      return
    }

    setFoundUser(user)
    setStep('security')
  }

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!foundUser) return

    const hashedAnswer = await hashPassword(securityAnswer.toLowerCase().trim())
    
    if (hashedAnswer !== foundUser.securityAnswer) {
      toast.error('Incorrect answer to security question')
      return
    }

    setStep('password')
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!foundUser) return

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    const hashedPassword = await hashPassword(newPassword)
    const updatedUsers = (users || []).map(u => 
      u.id === foundUser.id 
        ? { ...u, password: hashedPassword, mustChangePassword: false }
        : u
    )

    setUsers(updatedUsers)
    setStep('success')
    toast.success('Password reset successfully')
  }

  const goBack = () => {
    if (step === 'security') {
      setStep('email')
      setSecurityAnswer('')
    } else if (step === 'password') {
      setStep('security')
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {step === 'email' && 'Reset Password'}
            {step === 'security' && 'Security Question'}
            {step === 'password' && 'Set New Password'}
            {step === 'success' && 'Password Reset Complete'}
          </DialogTitle>
          <DialogDescription>
            {step === 'email' && 'Enter your email address to begin the password reset process'}
            {step === 'security' && 'Answer your security question to verify your identity'}
            {step === 'password' && 'Choose a new password for your account'}
            {step === 'success' && 'Your password has been successfully reset'}
          </DialogDescription>
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
                required
                autoFocus
                placeholder="your.email@example.com"
              />
            </div>
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
            <div className="space-y-2">
              <p className="text-sm font-medium">{foundUser.securityQuestion}</p>
              <Label htmlFor="security-answer">Your Answer</Label>
              <Input
                id="security-answer"
                type="text"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                required
                autoFocus
                autoComplete="off"
              />
              <p className="text-xs text-muted-foreground">Answer is not case-sensitive</p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={goBack}>
                <ArrowLeft size={16} className="mr-2" />
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
                autoFocus
                minLength={8}
              />
              <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
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
                placeholder="Re-enter your new password"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={goBack}>
                <ArrowLeft size={16} className="mr-2" />
                Back
              </Button>
              <Button type="submit">
                Reset Password
              </Button>
            </div>
          </form>
        )}

        {step === 'success' && (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="flex flex-col items-center gap-2">
              <CheckCircle size={48} weight="fill" className="text-primary" />
              <p className="text-center text-muted-foreground">
                You can now sign in with your new password
              </p>
            </div>
            <Button onClick={handleClose}>
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
