import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { SystemConfig } from '@/lib/types'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { SetupWizard } from '@/components/setup/SetupWizard'
import { LoginPage } from '@/components/LoginPage'
import { DashboardPage } from '@/components/DashboardPage'
import { NeighborManager } from '@/components/neighbors/NeighborManager'
import { FinanceManager } from '@/components/finance/FinanceManager'
import { MessagingPage } from '@/components/messaging/MessagingPage'
import { FiscalPeriodManager } from '@/components/dashboard/FiscalPeriodManager'
import { Button } from '@/components/ui/button'
import { ChartLine, Users, CurrencyDollar, ChatCircle, SignOut, House, CalendarBlank } from '@phosphor-icons/react'
import { Toaster } from '@/components/ui/sonner'

type Page = 'dashboard' | 'neighbors' | 'finance' | 'messaging' | 'periods'

function AppContent() {
  const { isAuthenticated, logout, user, isAdmin } = useAuth()
  const [systemConfig] = useKV<SystemConfig>('system-config', { isSetupComplete: false, totalHouses: 0 })
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')

  if (!systemConfig?.isSetupComplete) {
    return <SetupWizard />
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur">
        <div className="flex h-16 items-center px-6 gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <House size={24} weight="fill" />
            </div>
            <span className="font-bold text-xl">HOA Finance</span>
          </div>

          <nav className="flex gap-2 ml-8 flex-1">
            <Button
              variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => setCurrentPage('dashboard')}
              className="gap-2"
            >
              <ChartLine size={18} />
              Dashboard
            </Button>
            {isAdmin && (
              <Button
                variant={currentPage === 'periods' ? 'default' : 'ghost'}
                onClick={() => setCurrentPage('periods')}
                className="gap-2"
              >
                <CalendarBlank size={18} />
                Periods
              </Button>
            )}
            <Button
              variant={currentPage === 'neighbors' ? 'default' : 'ghost'}
              onClick={() => setCurrentPage('neighbors')}
              className="gap-2"
            >
              <Users size={18} />
              Neighbors
            </Button>
            <Button
              variant={currentPage === 'finance' ? 'default' : 'ghost'}
              onClick={() => setCurrentPage('finance')}
              className="gap-2"
            >
              <CurrencyDollar size={18} />
              Finance
            </Button>
            {isAdmin && (
              <Button
                variant={currentPage === 'messaging' ? 'default' : 'ghost'}
                onClick={() => setCurrentPage('messaging')}
                className="gap-2"
              >
                <ChatCircle size={18} />
                Messaging
              </Button>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <div className="text-sm text-right">
              <div className="font-medium">{user?.email}</div>
              <div className="text-xs text-muted-foreground capitalize">{user?.role}</div>
            </div>
            <Button variant="outline" size="icon" onClick={logout}>
              <SignOut size={18} />
            </Button>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {currentPage === 'dashboard' && <DashboardPage />}
          {currentPage === 'periods' && <FiscalPeriodManager />}
          {currentPage === 'neighbors' && <NeighborManager />}
          {currentPage === 'finance' && <FinanceManager />}
          {currentPage === 'messaging' && <MessagingPage />}
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  )
}

export default App