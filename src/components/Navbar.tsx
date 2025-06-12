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
  Github,
  MessageSquare
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { cn } from '@/lib/utils';
import { getNotifications } from '../services/notificationService';
import { PWAInstallButton } from './PWAInstallButton';
import { motion } from 'framer-motion';

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
    { icon: <MessageSquare size={20} />, title: t.navigation.chat, href: '/chat' },
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
            <SheetContent
              side="left"
              className="w-[300px] sm:w-[400px] p-0 bg-gradient-to-br from-background via-background/95 to-muted/30 backdrop-blur-sm border-r border-primary/10"
            >
              <div className="flex flex-col h-full">
                <SheetHeader className="p-4 border-b border-primary/10 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent">
                  <SheetTitle className="text-xl font-bold bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
                    Menu de Navegação
                  </SheetTitle>
                  <SheetDescription className="text-sm text-muted-foreground">
                    Acesse as diferentes seções do sistema através deste menu
                  </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto">
                  <div className="flex flex-col gap-1 p-4">
                    {menuItems.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start gap-3 h-11 text-base group relative overflow-hidden",
                            location.pathname === item.href
                              ? "bg-primary/10 text-primary hover:bg-primary/20"
                              : "hover:bg-primary/5"
                          )}
                          onClick={() => {
                            navigate(item.href);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <div className="relative z-10 flex items-center gap-3">
                            <div className={cn(
                              "p-1.5 rounded-lg transition-colors",
                              location.pathname === item.href
                                ? "bg-primary/20 text-primary"
                                : "bg-primary/10 text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                            )}>
                              {item.icon}
                            </div>
                            <span className="font-medium">{item.title}</span>
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-primary/10 p-4 bg-gradient-to-t from-primary/5 via-transparent to-transparent">
                  <div className="flex flex-col gap-3">
                    {currentUser && (
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-9 w-9 flex-shrink-0 ring-2 ring-primary/20">
                          <AvatarImage src="" alt={currentUser?.email || ""} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-purple-500 text-primary-foreground">
                            {userInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                            {currentUser?.email}
                          </p>
                          <p className="text-xs text-muted-foreground">Administrador</p>
                        </div>
                      </div>
                    )}

                    {currentUser && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 h-10 group relative overflow-hidden"
                          onClick={handleLogout}
                        >
                          <div className="relative z-10 flex items-center gap-2">
                            <Settings size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                            {t.logout.button}
                          </div>
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/dashboard" className="font-semibold text-xl flex items-center gap-2 group">
            <span className="text-primary group-hover:scale-110 transition-transform duration-300">CodeFlow</span>
            <span className="hidden md:inline text-foreground group-hover:scale-110 transition-transform duration-300">Solutions</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {menuItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Button
                variant="ghost"
                className={cn(
                  "flex items-center gap-2 group relative overflow-hidden px-4",
                  location.pathname === item.href && "text-primary"
                )}
                onClick={() => navigate(item.href)}
              >
                <div className="relative z-10 flex items-center gap-2">
                  <div className={cn(
                    "p-1.5 rounded-lg transition-colors",
                    location.pathname === item.href
                      ? "bg-primary/20 text-primary"
                      : "bg-primary/10 text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                  )}>
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.title}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-primary/10 group-hover:to-primary/5 transition-all duration-500" />
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hover:bg-accent group"
          >
            <a
              href="https://github.com/GabrielMacielZavarize/codeflow"
              target="_blank"
              rel="noopener noreferrer"
              title="Ver no GitHub"
            >
              <Github className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
            </a>
          </Button>

          <ThemeToggle />

          {currentUser && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="relative group"
                onClick={() => navigate('/notifications')}
              >
                <Bell className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 group">
                    <Avatar className="h-9 w-9 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                      <AvatarImage src="" alt={currentUser?.email || ""} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-purple-500 text-primary-foreground">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-sm border-primary/10">
                  <DropdownMenuLabel className="text-primary font-semibold">{t.settings.account.title}</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-primary/10" />
                  <DropdownMenuItem
                    onClick={() => navigate('/settings')}
                    className="focus:bg-primary/10 focus:text-primary cursor-pointer"
                  >
                    {t.navigation.settings}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-500 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950 cursor-pointer"
                  >
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
