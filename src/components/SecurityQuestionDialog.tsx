import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User } from '@/lib/types'
import { hashPassword } from '@/lib/password-utils'
import { toast } from 'sonner'
import { ShieldCheck } from '@phosphor-icons/react'

interface SecurityQuestionDialogProps {
  open: boolean
  onClose: () => void
  userId: string
}

const SECURITY_QUESTIONS = [
  "What was the name of your first pet?",
  "What is your mother's maiden name?",
  "What city were you born in?",
  "What was the name of your elementary school?",
  "What is your favorite color?",
  "What is the name of the street you grew up on?",
]

export function SecurityQuestionDialog({ open, onClose, userId }: SecurityQuestionDialogProps) {
  const [users, setUsers] = useKV<User[]>('system-users', [])
  const [selectedQuestion, setSelectedQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [confirmAnswer, setConfirmAnswer] = useState('')

  const currentUser = (users || []).find(u => u.id === userId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedQuestion) {
      toast.error('Please select a security question')
      return
    }

    if (answer.trim().length < 2) {
      toast.error('Answer must be at least 2 characters')
      return
    }

    if (answer.toLowerCase().trim() !== confirmAnswer.toLowerCase().trim()) {
      toast.error('Answers do not match')
      return
    }

    const hashedAnswer = await hashPassword(answer.toLowerCase().trim())

    setUsers((currentUsers) =>
      (currentUsers || []).map(u =>
        u.id === userId
          ? { ...u, securityQuestion: selectedQuestion, securityAnswer: hashedAnswer }
          : u
      )
    )

    toast.success('Security question set successfully!')
    setSelectedQuestion('')
    setAnswer('')
    setConfirmAnswer('')
    onClose()
  }

  const handleClose = () => {
    setSelectedQuestion('')
    setAnswer('')
    setConfirmAnswer('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="bg-accent/20 text-accent p-2 rounded-md">
              <ShieldCheck size={24} weight="fill" />
            </div>
            <div>
              <DialogTitle>Set Security Question</DialogTitle>
            </div>
          </div>
          <DialogDescription>
            {currentUser?.securityQuestion 
              ? 'Update your security question to help recover your password if you forget it.'
              : 'Set up a security question to help recover your password if you forget it.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {currentUser?.securityQuestion && (
            <div className="p-3 rounded-lg bg-muted/50 border text-sm">
              <p className="font-medium mb-1">Current Question:</p>
              <p className="text-muted-foreground">{currentUser.securityQuestion}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="security-question">Security Question</Label>
            <Select value={selectedQuestion} onValueChange={setSelectedQuestion} required>
              <SelectTrigger id="security-question">
                <SelectValue placeholder="Select a question..." />
              </SelectTrigger>
              <SelectContent>
                {SECURITY_QUESTIONS.map((question) => (
                  <SelectItem key={question} value={question}>
                    {question}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="answer">Answer</Label>
            <Input
              id="answer"
              type="text"
              placeholder="Enter your answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">
              Answer is not case-sensitive
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-answer">Confirm Answer</Label>
            <Input
              id="confirm-answer"
              type="text"
              placeholder="Re-enter your answer"
              value={confirmAnswer}
              onChange={(e) => setConfirmAnswer(e.target.value)}
              required
              autoComplete="off"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              {currentUser?.securityQuestion ? 'Update' : 'Set'} Security Question
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
