import { useState } from 'react'
import { Dialog, DialogContent, DialogDescr
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, S
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User } from '@/lib/types'
import { hashPassword } from '@/lib/password-utils'
import { toast } from 'sonner'
import { ArrowLeft, CheckCircle } from '@phosphor-icons/react'


  open: boolean
  "What is your mothe
}

  const [newPassword, setNewPassword] = useState('')

    setStep('email')
    setFoundUser(null)
    setNewPassword('')
    onClose()

    e.preventDefault()
    
 

    if (!user.securityQuestion || !user.securityAnswer) {
      return

    setStep('security')

    e.preventDefault()
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
    
            {step === 'success' && 'Your password has b

        {step === 'email' && (
    
              <Input
                type="email"
                value={emai
            
     

                Canc
   

          </form>

    
              <p className


              <Label htmlFor="security-answer">Your Answer<
            
     

                autoComplete="off"
              <p className="text-xs text-mu
            
     

                Back
    
              </Button>
          </form>

          <form onSubmit={handlePasswordReset} className="space-y-4">
             
       
     

                minLen
              <p className="text-xs text-muted-fo
   

              <Label htmlFor
                id="confirm-pa
                placeh
                onChange
                minLength={
            </div>
            <div classNam
                <ArrowLe
              </Button>
     
   

        {s
            <div className="flex flex-col items-cen
                <CheckCircle size={48} weight
              <p class
              </p>
            
              <Button onClick={handleClose}>
              </Button>
          </div>
      </DialogContent>
  )





































































































































