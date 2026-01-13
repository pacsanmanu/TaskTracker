import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { ModeToggle } from '@/components/ModeToggle'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, BarChart2, LogOut } from 'lucide-react'

const Navbar: React.FC = () => {
  const { signOut, user } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl">TaskTracker</span>
          </Link>
          <div className="flex gap-4">
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
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden md:inline-block">
            {user?.email}
          </span>
          <ModeToggle />
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
