import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Bell,
  Home,
  BarChart,
  Users,
  FileText,
  Calendar,
  Clock,
  Settings,
  Menu as MenuIcon,
  X,
  Github
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from '@/lib/utils';
import { getNotifications } from '../services/notificationService';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  useEffect(() => {
    const loadNotifications = async () => {
      if (currentUser) {
        try {
          const notifications = await getNotifications(currentUser.uid);
          const unread = notifications.filter(n => !n.read).length;
          setUnreadCount(unread);
        } catch (error) {
          console.error('Erro ao carregar notificações:', error);
        }
      }
    };

    loadNotifications();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error("Erro no logout:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const userInitials = currentUser?.email ? currentUser.email.substring(0, 2).toUpperCase() : 'US';

  // Check if we are on an auth route (login/register)
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

  // If on auth route, don't show Navbar
  if (isAuthRoute) {
    return null;
  }

  const menuItems = [
    { icon: <Home size={20} />, title: t.navigation.dashboard, href: '/dashboard' },
    { icon: <BarChart size={20} />, title: t.navigation.analytics, href: '/analytics' },
    { icon: <Users size={20} />, title: t.navigation.team, href: '/team' },
    { icon: <FileText size={20} />, title: t.navigation.reports, href: '/reports' },
    { icon: <Calendar size={20} />, title: t.navigation.calendar, href: '/calendar' },
    { icon: <Clock size={20} />, title: t.navigation.auditLogs, href: '/audit-logs' },
  ];

  const NavItems = () => (
    <>
      {menuItems.map((item, index) => (
        <Button
          key={index}
          variant="ghost"
          className={cn(
            "flex items-center gap-2",
            location.pathname === item.href && "text-primary"
          )}
          onClick={() => {
            navigate(item.href);
            setIsMobileMenuOpen(false);
          }}
        >
          {item.icon}
          <span>{item.title}</span>
        </Button>
      ))}
    </>
  );

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container flex items-center justify-between h-16 mx-auto px-4">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between border-b pb-4">
                  <h2 className="text-lg font-semibold">Menu</h2>
                </div>

                <div className="flex-1 py-6">
                  <div className="flex flex-col gap-2">
                    {menuItems.map((item, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className={cn(
                          "justify-start gap-3 h-12 text-base",
                          location.pathname === item.href && "bg-accent"
                        )}
                        onClick={() => {
                          navigate(item.href);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        {item.icon}
                        {item.title}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src="" alt={currentUser?.email || ""} />
                      <AvatarFallback className="bg-primary text-primary-foreground">{userInitials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{currentUser?.email}</p>
                      <p className="text-sm text-muted-foreground">Administrador</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                    onClick={handleLogout}
                  >
                    <Settings size={20} />
                    {t.logout.button}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/dashboard" className="font-semibold text-xl flex items-center gap-2">
            <span className="text-primary">CodeFlow</span>
            <span className="hidden md:inline text-foreground">Solutions</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <NavItems />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hover:bg-accent"
          >
            <a
              href="https://github.com/GabrielMacielZavarize/codeflow"
              target="_blank"
              rel="noopener noreferrer"
              title="Ver no GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </Button>

          <ThemeToggle />

          {currentUser && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => navigate('/notifications')}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
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
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
