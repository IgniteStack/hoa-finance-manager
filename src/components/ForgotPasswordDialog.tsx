import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { hashPassword } from '@/lib/password-
import { ArrowLeft, CheckCircle } from '@phos


  open: boolean
}
export function ForgotPasswordDialog({ open

  const [foundUser, setFoundUser] = useState<User | null>


    setStep('em
    setFoundUser(null
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
    
    }
    
      return

    const up
     

    setUsers(updatedUsers)
    toast.success('Password reset successfully')

    i

      setStep('securit
      setConfirmPasswor
  }

      <DialogContent>
          <DialogTitle
    
            {step === 'suc

            {step === 'security' && 'Answer your security question to verify you
    
        </DialogHeader>
        {step === 'email' && (
            
     

                onChang
   

            <div className="flex gap-2 justify-end">
                Cancel

              </Button>


          <form onSubmit={handleSecuritySubmit} className="
            
     

                onChange={(e) => setSecuri
                autoFocus
            
     

                Back
              <Button type="submit">
              </Button>
          </form>

     

                id="new-pa
                value=
                required
   

            <div classNa
              <Input
                type="
                onChange={(
                minLength={8}
              />
            <div classNa
                <ArrowLeft s
     
   

        )}
        {step === 'success' && (
            <div clas
              <p class
              </p>
            <Button onClick={handleClose}>
            </Button>
        )}
    </Dialog>
}













































                autoComplete="off"






                Back
              </Button>




          </form>



          <form onSubmit={handlePasswordReset} className="space-y-4">












            </div>
















              </Button>


              </Button>















          </div>

      </DialogContent>

  )

