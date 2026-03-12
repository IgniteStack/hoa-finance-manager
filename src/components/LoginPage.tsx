import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { House } from '@phosphor-icons/react'
import { toast } from 'sonner'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const success = await login(email, password)
    
    if (success) {
      toast.success('Welcome back!')
    } else {
      toast.error('Invalid credentials')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
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
                placeholder="admin@hoa.com"
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
          <div className="mt-6 p-4 bg-muted rounded-lg space-y-2 text-sm">
            <p className="font-medium">Demo Credentials:</p>
            <div className="space-y-1 text-muted-foreground">
              <p><strong>Admin:</strong> admin@hoa.com / admin123</p>
              <p><strong>Neighbor:</strong> neighbor@hoa.com / neighbor123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}