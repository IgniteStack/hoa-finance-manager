import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User } from '@/lib/types'
import { hashPassword } from '@/lib/password-utils'
import { toast } from 'sonner'
import { ArrowLeft, CheckCircle } from '@phosphor-icons/react'

interface ForgotPasswordDialogProps {
  open: boolean
  onClose: () => void
}

type Step = 'email' | 'security' | 'reset' | 'success'

const SECURITY_QUESTIONS = [
  "What was the name of your first pet?",
  "What is your mother's maiden name?",
  "What city were you born in?",
  "What was the name of your elementary school?",
  "What is your favorite color?",
  "What is the name of the street you grew up on?",
]

export function ForgotPasswordDialog({ open, onClose }: ForgotPasswordDialogProps) {
  const [users, setUsers] = useKV<User[]>('system-users', [])
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
    
    if (!foundUser || !foundUser.securityAnswer) return

    const answerHash = await hashPassword(securityAnswer.toLowerCase().trim())
    
    if (answerHash !== foundUser.securityAnswer) {
      toast.error('Incorrect security answer')
      setSecurityAnswer('')
      return
    }

    setStep('reset')
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
    
    setUsers((currentUsers) => 
      (currentUsers || []).map(u => 
        u.id === foundUser.id 
          ? { ...u, password: hashedPassword, mustChangePassword: false }
          : u
      )
    )

    setStep('success')
    toast.success('Password reset successfully!')
  }

  const handleBack = () => {
    if (step === 'security') {
      setStep('email')
      setFoundUser(null)
      setSecurityAnswer('')
    } else if (step === 'reset') {
      setStep('security')
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'email' && 'Reset Password'}
            {step === 'security' && 'Security Question'}
            {step === 'reset' && 'Create New Password'}
            {step === 'success' && 'Password Reset Complete'}
          </DialogTitle>
          <DialogDescription>
            {step === 'email' && 'Enter your email address to begin the password reset process.'}
            {step === 'security' && 'Answer your security question to verify your identity.'}
            {step === 'reset' && 'Enter and confirm your new password.'}
            {step === 'success' && 'Your password has been successfully reset.'}
          </DialogDescription>
        </DialogHeader>

        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email Address</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
            <div className="p-4 rounded-lg bg-muted/50 border">
              <p className="text-sm font-medium text-foreground">
                {foundUser.securityQuestion}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="security-answer">Your Answer</Label>
              <Input
                id="security-answer"
                type="text"
                placeholder="Enter your answer"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                required
                autoComplete="off"
              />
              <p className="text-xs text-muted-foreground">
                Answer is not case-sensitive
              </p>
            </div>
            
            <div className="flex gap-2 justify-between">
              <Button type="button" variant="outline" onClick={handleBack}>
                <ArrowLeft size={16} className="mr-2" />
                Back
              </Button>
              <Button type="submit">
                Verify
              </Button>
            </div>
          </form>
        )}

        {step === 'reset' && (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
              />
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            
            <div className="flex gap-2 justify-between">
              <Button type="button" variant="outline" onClick={handleBack}>
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
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="bg-accent/20 text-accent p-4 rounded-full mb-4">
                <CheckCircle size={48} weight="fill" />
              </div>
              <p className="text-sm text-muted-foreground">
                You can now sign in with your new password.
              </p>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={handleClose}>
                Go to Login
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
