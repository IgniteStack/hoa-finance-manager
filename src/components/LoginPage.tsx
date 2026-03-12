import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ChangePasswordDialog } from '@/components/ChangePasswordDialog'
import { House, EnvelopeSimple, Copy } from '@phosphor-icons/react'
import { toast } from 'sonner'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [showForgotEmail, setShowForgotEmail] = useState(false)
  const { login, users } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const result = await login(email, password)
    
    if (result.success) {
      if (result.mustChangePassword) {
        setShowPasswordChange(true)
        toast.info('Please change your password')
      } else {
        toast.success('Welcome back!')
      }
    } else {
      toast.error('Invalid credentials')
    }
    
    setIsLoading(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Email copied to clipboard')
  }

  const adminUsers = users.filter(u => u.role === 'admin')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <ChangePasswordDialog 
        open={showPasswordChange} 
        onClose={() => setShowPasswordChange(false)} 
      />
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary text-primary-foreground p-4 rounded-full">
              <House size={32} weight="fill" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">HOA Finance Manager</CardTitle>
          <CardDescription>
            Sign in to manage your community finances
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <Button 
              variant="link" 
              onClick={() => setShowForgotEmail(true)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Forgot your email?
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showForgotEmail} onOpenChange={setShowForgotEmail}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admin Email Addresses</DialogTitle>
            <DialogDescription>
              {adminUsers.length > 0 
                ? 'Here are all the administrator email addresses in the system:' 
                : 'No admin users found in the system.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 mt-4">
            {adminUsers.map((user) => (
              <div 
                key={user.id} 
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="bg-primary/10 text-primary p-2 rounded-md shrink-0">
                    <EnvelopeSimple size={18} weight="fill" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{user.email}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(user.email)}
                  className="shrink-0"
                >
                  <Copy size={18} />
                </Button>
              </div>
            ))}
            
            {adminUsers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No administrator accounts found.</p>
                <p className="text-sm mt-2">You may need to run the setup wizard again.</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setShowForgotEmail(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}