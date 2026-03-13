import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { SystemConfig } from '@/lib/types'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { SetupWizard } from '@/components/setup/SetupWizard'
import { LoginPage } from '@/components/LoginPage'
import { DashboardPage } from '@/components/DashboardPage'
import { MemberManager } from '@/components/members/MemberManager'
import { MemberProfile } from '@/components/members/MemberProfile'
import { FinanceManager } from '@/components/finance/FinanceManager'
import { MessagingPage } from '@/components/messaging/MessagingPage'
import { FiscalPeriodManager } from '@/components/dashboard/FiscalPeriodManager'
import { NotificationBell } from '@/components/NotificationBell'
import { ChangePasswordDialog } from '@/components/ChangePasswordDialog'
import { SecurityQuestionDialog } from '@/components/SecurityQuestionDialog'
import { SyncIndicator } from '@/components/SyncIndicator'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { ChartLine, Users, CurrencyDollar, ChatCircle, SignOut, House, CalendarBlank, List, User as UserIcon, Key, ShieldCheck, ArrowCounterClockwise, UserCircle } from '@phosphor-icons/react'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'

type Page = 'dashboard' | 'members' | 'finance' | 'messaging' | 'periods' | 'profile'

function AppContent() {
  const { isAuthenticated, logout, user, isAdmin } = useAuth()
  const [systemConfig] = useKV<SystemConfig>('system-config', { isSetupComplete: false, totalHouses: 0 })
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [showSecurityQuestion, setShowSecurityQuestion] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const handleResetSetup = async () => {
    const keys = await window.spark.kv.keys()
    for (const key of keys) {
      await window.spark.kv.delete(key)
    }
    toast.success('System reset complete. Reloading...')
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

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
        variant={currentPage === 'members' ? 'default' : 'ghost'}
        onClick={() => navigateTo('members')}
        className="gap-2 w-full md:w-auto justify-start"
      >
        <Users size={18} />
        Members
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
        <Button
          variant={currentPage === 'messaging' ? 'default' : 'ghost'}
          onClick={() => navigateTo('messaging')}
          className="gap-2 w-full md:w-auto justify-start"
        >
          <ChatCircle size={18} />
          Messaging
        </Button>
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
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <UserIcon size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.email}</p>
                    <p className="text-xs leading-none text-muted-foreground capitalize">{user?.role}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigateTo('profile')}>
                  <UserCircle size={16} className="mr-2" />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowPasswordChange(true)}>
                  <Key size={16} className="mr-2" />
                  Change Password
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowSecurityQuestion(true)}>
                  <ShieldCheck size={16} className="mr-2" />
                  Security Question
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <>
                    <DropdownMenuItem 
                      onClick={() => setShowResetConfirm(true)}
                      className="text-destructive focus:text-destructive"
                    >
                      <ArrowCounterClockwise size={16} className="mr-2" />
                      Reset Setup
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={logout}>
                  <SignOut size={16} className="mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
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
          {currentPage === 'members' && <MemberManager />}
          {currentPage === 'finance' && <FinanceManager />}
          {currentPage === 'messaging' && <MessagingPage />}
          {currentPage === 'profile' && user && (
            <MemberProfile 
              memberId={user.id} 
              onBack={() => setCurrentPage('dashboard')} 
            />
          )}
        </div>
      </main>

      <ChangePasswordDialog 
        open={showPasswordChange} 
        onClose={() => setShowPasswordChange(false)} 
      />
      
      {user && (
        <SecurityQuestionDialog
          open={showSecurityQuestion}
          onClose={() => setShowSecurityQuestion(false)}
          userId={user.id}
        />
      )}

      <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Setup Wizard?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete all data including neighbors, payments, expenses, users, and system configuration. 
              You will be returned to the setup wizard to start fresh. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetSetup} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Reset Everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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