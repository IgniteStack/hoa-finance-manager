import { useState } from 'react'
import { Button } from '@/components/ui/but
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/co
import { hashPassword, verifyPassword } from 
import { ArrowLeft, CheckCircle } from '@phosphor-icons/react'
interface ForgotPasswordDialogProps {
  onClose: () => void
import { hashPassword, verifyPassword } from '@/lib/password-utils'
import { toast } from 'sonner'
import { ArrowLeft, CheckCircle } from '@phosphor-icons/react'

interface ForgotPasswordDialogProps {
  open: boolean
  onClose: () => void
}

    setNewPassword('')

  }
  const handleEmailSubmit = async (e: React.FormEvent) => {
    setError('')
    const user = (users || []).find(u =>
    if (!user) {
      return

      setError('This account does not have a security questi
    }

  }
  const handleSecuri
    setError('')
    if (!foundUser || 
      return
    setNewPassword('')
    setConfirmPassword('')
    setError('')
    onClose()
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const user = (users || []).find(u => u.email.toLowerCase() === email.toLowerCase())
    
    if (!user) {
      setError('No account found with this email address')
      return
    }

    if (!user.securityQuestion || !user.securityAnswer) {
      setError('This account does not have a security question set up. Please contact an administrator.')
      return
    }

    setFoundUser(user)

   

  }
  return (
      <DialogCon

            {step === 'security' && 'Security Ques
            {step === 'success' && 'Password R
          <D
     

        </DialogHeader>
    
            <div cl
              <Input
            
     

            </div>
   

            )}
            <Button ty
            </Bu

        {step === 'security' && f
            <div className="p-3 rounded-lg bg-muted/50 border
            


                id="security-answer"
                value={securityAnswer}
            
     

              </p>

              <Alert variant="destructive">
    

              <Button type="but
                Back
              <Button type="submit" className="flex-1">
             
       


              <Label htmlFor="new-password">New P
                id="ne
   

              />

              <Label html
                id="
   

              />

              <Alert v
              </Alert>

   

          
              </Button>
          </form>

          <div classNam
              <div className="bg-accent/20 text-acc
              </div>
                Your password has been reset successf
            </div>
            <Button onCl
            </Button>
        )}
    </Dialog>
}






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

}
