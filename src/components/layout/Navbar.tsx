import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { ModeToggle } from '@/components/ModeToggle'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, BarChart2, LogOut, Settings } from 'lucide-react'
import { MobileNav } from './MobileNav'

const Navbar: React.FC = () => {
  const { signOut, user } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-theme">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <MobileNav />
          <Link to="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl tracking-tight text-primary">Taskator</span>
          </Link>
          <div className="hidden md:flex gap-6">
            <Link 
              to="/" 
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
            <Link 
              to="/stats" 
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <BarChart2 className="mr-2 h-4 w-4" />
              Stats
            </Link>
            <Link 
              to="/settings" 
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden lg:flex flex-col items-end mr-2">
            <span className="text-xs text-muted-foreground">Signed in as</span>
            <span className="text-sm font-medium truncate max-w-[150px]">{user?.email}</span>
          </div>
          <ModeToggle />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleSignOut}
            className="hidden md:flex text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
