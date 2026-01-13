import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet'
import { Menu, LayoutDashboard, BarChart2, Settings, LogOut } from 'lucide-react'
import { useState } from 'react'

export function MobileNav() {
  const { signOut, user } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    setOpen(false)
    navigate('/login')
  }

  const menuItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/stats', icon: BarChart2, label: 'Stats' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle className="text-left text-xl font-bold flex items-center gap-2">
            Taskator
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-8">
          <div className="text-sm text-muted-foreground px-2 mb-2">
            {user?.email}
          </div>
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-2 py-2 text-lg font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
          <Button 
            variant="ghost" 
            className="justify-start gap-3 px-2 mt-4 text-lg font-medium text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
