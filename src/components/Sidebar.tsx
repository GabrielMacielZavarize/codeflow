
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  BarChart,
  Users,
  Bell,
  Settings,
  FileText,
  Calendar,
  Clock,
  User,
  LogOut,
} from 'lucide-react';
import { Sheet } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

type SidebarItemProps = {
  icon: React.ReactNode;
  title: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon, title, href, active, onClick }: SidebarItemProps) => {
  const { state } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <Link
      to={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
        active && "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50",
        !isMobile && state === "collapsed" && "justify-center p-2"
      )}
    >
      {icon}
      {(!isMobile && state !== "collapsed" || isMobile) && <span>{title}</span>}
    </Link>
  )
}

const Sidebar = () => {
  const { pathname } = useLocation();
  const { state } = useSidebar();
  const isMobile = useIsMobile();
  const { currentUser, logout } = useAuth();
  const { t } = useLanguage();

  const handleLogout = async () => {
    try {
      await logout();
      // Navigation is now handled in the AuthContext logout function
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const menuItems = [
    { icon: <Home size={20} />, title: t.navigation.dashboard, href: '/dashboard', active: pathname === '/dashboard' },
    { icon: <BarChart size={20} />, title: t.navigation.analytics, href: '/analytics', active: pathname === '/analytics' },
    { icon: <Users size={20} />, title: t.navigation.team, href: '/team', active: pathname === '/team' },
    { icon: <Bell size={20} />, title: t.navigation.notifications, href: '/notifications', active: pathname === '/notifications' },
    { icon: <FileText size={20} />, title: t.navigation.reports, href: '/reports', active: pathname === '/reports' },
    { icon: <Clock size={20} />, title: t.navigation.auditLogs, href: '/audit-logs', active: pathname === '/audit-logs' },
    { icon: <Calendar size={20} />, title: t.navigation.calendar, href: '/calendar', active: pathname === '/calendar' },
    { icon: <Settings size={20} />, title: t.navigation.settings, href: '/settings', active: pathname === '/settings' },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center h-14 px-4 border-b">
        <Link to="/dashboard" className="font-bold text-xl flex items-center gap-2">
          <span className="text-primary">CodeFlow</span>
          {(!isMobile && state !== "collapsed" || isMobile) && (
            <span className="dark:text-gray-200">Solutions</span>
          )}
        </Link>
      </div>
      
      <ScrollArea className="flex-1 px-2 py-4">
        <div className="space-y-1">
          {menuItems.map((item, index) => (
            <SidebarItem
              key={index}
              icon={item.icon}
              title={item.title}
              href={item.href}
              active={item.active}
            />
          ))}
        </div>
      </ScrollArea>
      
      <div className="border-t p-4 mt-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <User size={20} className="text-gray-500 dark:text-gray-400" />
          </div>
          {(!isMobile && state !== "collapsed" || isMobile) && (
            <div>
              <p className="font-medium text-sm dark:text-gray-200">{t.general.administrator}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser?.email || "admin@admin.com"}</p>
            </div>
          )}
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2" 
          onClick={handleLogout}
        >
          <LogOut size={18} />
          {(!isMobile && state !== "collapsed" || isMobile) && t.logout.button}
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet>
        <div className="fixed inset-y-0 z-50 flex flex-col w-72 dark:bg-gray-900 dark:border-gray-800">
          {sidebarContent}
        </div>
      </Sheet>
    );
  }

  return (
    <div
      className={cn(
        "hidden lg:flex flex-col border-r h-screen dark:bg-gray-900 dark:border-gray-800",
        state === "collapsed" ? "w-16" : "w-64"
      )}
    >
      {sidebarContent}
    </div>
  );
};

export default Sidebar;
