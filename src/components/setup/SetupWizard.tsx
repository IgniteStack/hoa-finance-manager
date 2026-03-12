import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { SystemConfig, Neighbor, FiscalPeriod } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowRight, ArrowLeft, CheckCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'

export function SetupWizard() {
  const [, setSystemConfig] = useKV<SystemConfig>('system-config', { isSetupComplete: false, totalHouses: 0 })
  const [, setNeighbors] = useKV<Neighbor[]>('neighbors', [])
  const [, setFiscalPeriods] = useKV<FiscalPeriod[]>('fiscal-periods', [])
  const [, setAuthUser] = useKV<any>('auth-user', undefined)

  const [step, setStep] = useState(1)
  const [totalHouses, setTotalHouses] = useState('')
  
  const [adminData, setAdminData] = useState({
    firstName: '',
    lastName: '',
    houseNumber: '',
    phoneNumber: '',
    email: '',
    password: ''
  })

  const [periodData, setPeriodData] = useState({
    name: '',
    type: 'monthly' as const,
    startDate: '',
    endDate: ''
  })

  const handleAdminSubmit = () => {
    if (!adminData.firstName || !adminData.lastName || !adminData.houseNumber || 
        !adminData.phoneNumber || !adminData.email || !adminData.password) {
      toast.error('Please fill all required fields')
      return
    }

    const totalHousesNum = parseInt(totalHouses)
    if (isNaN(totalHousesNum) || totalHousesNum < 1) {
      toast.error('Please enter a valid number of houses')
      return
    }

    setStep(2)
  }

  const handlePeriodSubmit = () => {
    if (!periodData.name || !periodData.startDate || !periodData.endDate) {
      toast.error('Please fill all period fields')
      return
    }

    const adminNeighbor: Neighbor = {
      id: 'admin-1',
      firstName: adminData.firstName,
      lastName: adminData.lastName,
      houseNumber: adminData.houseNumber,
      phoneNumber: adminData.phoneNumber,
      ownershipStatus: 'owner',
      roleType: 'management',
      active: true,
      createdAt: new Date().toISOString()
    }

    const firstPeriod: FiscalPeriod = {
      id: 'period-1',
      name: periodData.name,
      type: periodData.type,
      startDate: periodData.startDate,
      endDate: periodData.endDate,
      isClosed: false,
      createdAt: new Date().toISOString()
    }

    setNeighbors([adminNeighbor])
    setFiscalPeriods([firstPeriod])
    
    setSystemConfig({
      isSetupComplete: true,
      totalHouses: parseInt(totalHouses),
      setupCompletedAt: new Date().toISOString()
    })

    setAuthUser(() => ({
      id: 'admin-1',
      email: adminData.email,
      role: 'admin',
      neighborId: 'admin-1'
    }))

    toast.success('Setup complete! Welcome to HOA Finance Manager')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="text-3xl">Welcome to HOA Finance Manager</CardTitle>
          <CardDescription>
            Let's set up your community management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {step > 1 ? <CheckCircle size={20} weight="fill" /> : '1'}
              </div>
              <div className="flex-1 h-1 bg-muted">
                <div className={`h-full ${step >= 2 ? 'bg-primary' : ''} transition-all`} />
              </div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                2
              </div>
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="font-medium">Admin Setup</span>
              <span className="font-medium">Fiscal Period</span>
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Community Configuration</h3>
                <div className="space-y-2">
                  <Label htmlFor="totalHouses">Total Number of Houses *</Label>
                  <Input
                    id="totalHouses"
                    type="number"
                    min="1"
                    value={totalHouses}
                    onChange={(e) => setTotalHouses(e.target.value)}
                    placeholder="Enter total houses in the community"
                  />
                  <p className="text-sm text-muted-foreground">
                    This will be used to create house number options for residents
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">First Administrator</h3>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={adminData.firstName}
                        onChange={(e) => setAdminData({ ...adminData, firstName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={adminData.lastName}
                        onChange={(e) => setAdminData({ ...adminData, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="houseNumber">House Number *</Label>
                      <Input
                        id="houseNumber"
                        value={adminData.houseNumber}
                        onChange={(e) => setAdminData({ ...adminData, houseNumber: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number *</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={adminData.phoneNumber}
                        onChange={(e) => setAdminData({ ...adminData, phoneNumber: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Login) *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={adminData.email}
                      onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={adminData.password}
                      onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleAdminSubmit} size="lg">
                  Continue
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">First Fiscal Period</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your initial fiscal period. You can add more later from the dashboard.
                </p>
                
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="periodName">Period Name *</Label>
                    <Input
                      id="periodName"
                      value={periodData.name}
                      onChange={(e) => setPeriodData({ ...periodData, name: e.target.value })}
                      placeholder="e.g., January 2024, Q1 2024, FY 2024"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="periodType">Period Type *</Label>
                    <Select
                      value={periodData.type}
                      onValueChange={(value: any) => setPeriodData({ ...periodData, type: value })}
                    >
                      <SelectTrigger id="periodType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={periodData.startDate}
                        onChange={(e) => setPeriodData({ ...periodData, startDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={periodData.endDate}
                        onChange={(e) => setPeriodData({ ...periodData, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button onClick={() => setStep(1)} variant="outline" size="lg">
                  <ArrowLeft className="mr-2" size={18} />
                  Back
                </Button>
                <Button onClick={handlePeriodSubmit} size="lg">
                  Complete Setup
                  <CheckCircle className="ml-2" size={18} />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
