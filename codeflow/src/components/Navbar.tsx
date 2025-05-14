
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';
import { useLanguage } from '../contexts/LanguageContext';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { t } = useLanguage();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
  };

  return (
    <header className="bg-background border-b border-border">
      <div className="container flex flex-col md:flex-row items-center justify-between h-auto md:h-16 mx-auto px-4 py-2">
        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start mb-2 md:mb-0">
          <Link to="/dashboard" className="font-semibold text-xl">CodeFlow</Link>
          
          <div className="block md:hidden">
            <ThemeToggle />
          </div>
          
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/dashboard" className={navigationMenuTriggerStyle()}>
                  {t.navigation.dashboard}
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/analytics" className={navigationMenuTriggerStyle()}>
                  {t.navigation.analytics}
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        <div className="flex flex-wrap items-center justify-center w-full md:w-auto gap-2 md:gap-4">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          
          <div className="flex gap-2 flex-wrap justify-center">
            {currentUser ? (
              <Button 
                variant="outline" 
                onClick={handleLogout} 
                disabled={isLoggingOut}
                className="w-full sm:w-auto"
              >
                {isLoggingOut ? t.logout.processing : t.logout.button}
              </Button>
            ) : (
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link to="/login">{t.login.title}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex md:hidden overflow-x-auto">
        <NavigationMenu className="w-full">
          <NavigationMenuList className="flex w-full px-4 py-2">
            <NavigationMenuItem className="flex-1 text-center">
              <Link to="/dashboard" className="block py-2">
                {t.navigation.dashboard}
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem className="flex-1 text-center">
              <Link to="/analytics" className="block py-2">
                {t.navigation.analytics}
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem className="flex-1 text-center">
              <Link to="/settings" className="block py-2">
                {t.navigation.settings}
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};

export default Navbar;
