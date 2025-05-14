
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Bell, Menu as MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ThemeToggle from './ThemeToggle';
import { toast } from '@/components/ui/sonner';
import { useSidebar } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '../contexts/LanguageContext';

const MenuBar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const sidebar = useSidebar();
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  // Check if we are on an auth route (login/register)
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

  // If on auth route, don't show MenuBar
  if (isAuthRoute) {
    return null;
  }
  
  const handleLogout = async () => {
    try {
      await logout();
      toast(t.logout.success);
    } catch (error) {
      console.error("Erro no logout:", error);
      toast(t.logout.error);
    }
  };
  
  const userInitials = currentUser?.email ? currentUser.email.substring(0, 2).toUpperCase() : 'US';
  
  return (
    <div className="w-full h-auto md:h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4">
      <div className="flex flex-col md:flex-row items-center justify-between py-2 md:h-full">
        <div className="flex items-center w-full md:w-auto justify-between md:justify-start mb-2 md:mb-0">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => sidebar.toggleSidebar()}>
            <MenuIcon className="h-5 w-5" />
          </Button>
          
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            {location.pathname === '/dashboard' && t.navigation.dashboard}
            {location.pathname === '/analytics' && t.navigation.analytics}
            {location.pathname === '/team' && t.navigation.team}
            {location.pathname === '/notifications' && t.navigation.notifications}
            {location.pathname === '/reports' && t.navigation.reports}
            {location.pathname === '/calendar' && t.navigation.calendar}
            {location.pathname === '/audit-logs' && t.navigation.auditLogs}
            {location.pathname === '/settings' && t.navigation.settings}
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="" alt={currentUser?.email || ""} />
                  <AvatarFallback className="bg-primary text-primary-foreground">{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{t.settings.account.title}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                {t.navigation.settings}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                {t.logout.button}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default MenuBar;
