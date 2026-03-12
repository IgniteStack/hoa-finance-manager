import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { SystemConfig } from '@/lib/types'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { SetupWizard } from '@/components/setup/SetupWizard'
import { LoginPage } from '@/components/LoginPage'
import { DashboardPage } from '@/components/DashboardPage'
import { NeighborManager } from '@/components/neighbors/NeighborManager'
import { FinanceManager } from '@/components/finance/FinanceManager'
import { MessagingPage } from '@/components/messaging/MessagingPage'
import { FiscalPeriodManager } from '@/components/dashboard/FiscalPeriodManager'
import { UserManager } from '@/components/dashboard/UserManager'
import { NotificationBell } from '@/components/NotificationBell'
import { ChangePasswordDialog } from '@/components/ChangePasswordDialog'
import { SyncIndicator } from '@/components/SyncIndicator'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ChartLine, Users, CurrencyDollar, ChatCircle, SignOut, House, CalendarBlank, List, UserGear } from '@phosphor-icons/react'
import { Toaster } from '@/components/ui/sonner'

type Page = 'dashboard' | 'neighbors' | 'finance' | 'messaging' | 'periods' | 'users'

function AppContent() {
  const { isAuthenticated, logout, user, isAdmin } = useAuth()
  const [systemConfig] = useKV<SystemConfig>('system-config', { isSetupComplete: false, totalHouses: 0 })
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showPasswordChange, setShowPasswordChange] = useState(false)

  if (!systemConfig?.isSetupComplete) {
    return <SetupWizard />
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  if (user?.mustChangePassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <ChangePasswordDialog 
          open={true} 
          onClose={() => {}} 
        />
      </div>
    )
  }

  const navigateTo = (page: Page) => {
    setCurrentPage(page)
    setMobileMenuOpen(false)
  }

  const NavLinks = () => (
    <>
      <Button
        variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
        onClick={() => navigateTo('dashboard')}
        className="gap-2 w-full md:w-auto justify-start"
      >
        <ChartLine size={18} />
        Dashboard
      </Button>
      {isAdmin && (
        <Button
          variant={currentPage === 'periods' ? 'default' : 'ghost'}
          onClick={() => navigateTo('periods')}
          className="gap-2 w-full md:w-auto justify-start"
        >
          <CalendarBlank size={18} />
          Periods
        </Button>
      )}
      <Button
        variant={currentPage === 'neighbors' ? 'default' : 'ghost'}
        onClick={() => navigateTo('neighbors')}
        className="gap-2 w-full md:w-auto justify-start"
      >
        <Users size={18} />
        Neighbors
      </Button>
      <Button
        variant={currentPage === 'finance' ? 'default' : 'ghost'}
        onClick={() => navigateTo('finance')}
        className="gap-2 w-full md:w-auto justify-start"
      >
        <CurrencyDollar size={18} />
        Finance
      </Button>
      {isAdmin && (
        <>
          <Button
            variant={currentPage === 'messaging' ? 'default' : 'ghost'}
            onClick={() => navigateTo('messaging')}
            className="gap-2 w-full md:w-auto justify-start"
          >
            <ChatCircle size={18} />
            Messaging
          </Button>
          <Button
            variant={currentPage === 'users' ? 'default' : 'ghost'}
            onClick={() => navigateTo('users')}
            className="gap-2 w-full md:w-auto justify-start"
          >
            <UserGear size={18} />
            Users
          </Button>
        </>
      )}
    </>
  )

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="flex h-16 items-center px-4 md:px-6 gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <House size={24} weight="fill" />
            </div>
            <span className="font-bold text-lg md:text-xl">HOA Finance</span>
          </div>

          <nav className="hidden md:flex gap-2 ml-8 flex-1">
            <NavLinks />
          </nav>

          <div className="flex items-center gap-2 md:gap-4 ml-auto">
            <NotificationBell />
            <div className="hidden sm:block text-sm text-right">
              <div className="font-medium truncate max-w-[150px] md:max-w-none">{user?.email}</div>
              <div className="text-xs text-muted-foreground capitalize">{user?.role}</div>
            </div>
            <Button variant="outline" size="icon" onClick={logout} className="shrink-0">
              <SignOut size={18} />
            </Button>
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden shrink-0">
                  <List size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-2">
                  <div className="pb-4 mb-4 border-b">
                    <div className="text-sm font-medium truncate">{user?.email}</div>
                    <div className="text-xs text-muted-foreground capitalize">{user?.role}</div>
                  </div>
                  <NavLinks />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {currentPage === 'dashboard' && <DashboardPage />}
          {currentPage === 'periods' && <FiscalPeriodManager />}
          {currentPage === 'neighbors' && <NeighborManager />}
          {currentPage === 'finance' && <FinanceManager />}
          {currentPage === 'messaging' && <MessagingPage />}
          {currentPage === 'users' && <UserManager />}
        </div>
      </main>

      <ChangePasswordDialog 
        open={showPasswordChange} 
        onClose={() => setShowPasswordChange(false)} 
      />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
        <SyncIndicator />
        <Toaster />
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App