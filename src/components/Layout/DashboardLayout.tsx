
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  PackageOpen,
  User,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Separator } from '@/components/ui/separator';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  isCollapsed: boolean;
}

const SidebarItem = ({ icon: Icon, label, to, isCollapsed }: SidebarItemProps) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 transition-all',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'hover:bg-muted text-muted-foreground hover:text-foreground'
      )
    }
  >
    <Icon className="h-5 w-5" />
    {!isCollapsed && <span className="truncate">{label}</span>}
  </NavLink>
);

export function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, user } = useAuth();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard ', to: '/admin/home' },
    { icon: PackageOpen, label: 'Parking Slots', to: '/admin/dashboard/slots' },
    { icon: Car, label: 'Vehicles', to: '/admin/dashboard/vehicles' },
    { icon: Users, label: 'Orders', to: '/admin/dashboard/orders' },
    { icon: User, label: 'My Profile', to: '/admin/dashboard/profile' },
  ];

  if (user?.role === 'ADMIN') {
    sidebarItems.splice(4, 0, { icon: Users, label: 'Users', to: '/admin/dashboard/users' });
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button size="icon" variant="outline" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 w-80 bg-background shadow-lg p-4">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">ParkSmart</h2>
                <Button size="icon" variant="ghost" onClick={toggleMobileMenu}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="space-y-1">
                {sidebarItems.map((item) => (
                  <SidebarItem
                  
                    key={item.to}
                    icon={item.icon}
                    label={item.label}
                    to={item.to}
                    isCollapsed={false}
                  />
                ))}
              </div>
              <div className="mt-auto">
                <Separator className="my-4" />
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                  onClick={() => logout()}
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div
        className={cn(
          'hidden lg:flex flex-col border-r bg-muted/40 transition-all',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex h-14 items-center px-4 border-b">
          {!isCollapsed ? (
            <h2 className="text-lg font-semibold">ParkSmart</h2>
          ) : (
            <span className="mx-auto font-bold">PS</span>
          )}
        </div>
        <div className="flex flex-col flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.to}
              icon={item.icon}
              label={item.label}
              to={item.to}
              isCollapsed={isCollapsed}
            />
          ))}
          <div className="mt-auto pt-4">
  
            <Button
              variant="ghost"
              className={cn(
                'w-full mt-2 justify-start text-muted-foreground hover:text-foreground',
                isCollapsed && 'px-2 justify-center'
              )}
              onClick={() => logout()}
            >
              <LogOut className={cn('h-5 w-5', !isCollapsed && 'mr-2')} />
              {!isCollapsed && <span>Logout</span>}
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="container py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
