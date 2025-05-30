import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
    const { currentUser } = useAuth();

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
                <Link to="/" className="flex items-center gap-2 group">
                    <span className="text-xl font-bold text-primary group-hover:scale-110 transition-transform">CodeFlow</span>
                    <span className="text-xl font-semibold text-gray-700 dark:text-gray-300 hidden sm:inline group-hover:scale-110 transition-transform">Solutions</span>
                </Link>
                <nav className="flex-1 flex items-center justify-center">
                    <div className="hidden md:flex items-center gap-12">
                        <a href="#historia" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-all duration-300 text-lg font-medium hover:scale-110">
                            Nossa História
                        </a>
                        <a href="#funcionalidades" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-all duration-300 text-lg font-medium hover:scale-110">
                            Funcionalidades
                        </a>
                        <a href="#equipe" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-all duration-300 text-lg font-medium hover:scale-110">
                            Equipe
                        </a>
                    </div>
                </nav>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="hover:bg-accent hover:scale-110 transition-all duration-300"
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
                    {currentUser ? (
                        <Button asChild className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 text-sm sm:text-base">
                            <Link to="/dashboard">Acessar Dashboard</Link>
                        </Button>
                    ) : (
                        <>
                            <Button variant="outline" asChild className="hidden sm:flex border-2 transition-all duration-300 hover:scale-105 text-sm sm:text-base">
                                <Link to="/register">Criar Conta</Link>
                            </Button>
                            <Button asChild className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 text-sm sm:text-base">
                                <Link to="/login">Entrar</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header; 