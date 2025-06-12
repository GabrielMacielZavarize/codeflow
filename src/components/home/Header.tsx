import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Github, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '../ThemeToggle';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";

const Header = () => {
    const { currentUser } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { href: "#historia", label: "Nossa História" },
        { href: "#funcionalidades", label: "Funcionalidades" },
        { href: "#equipe", label: "Equipe" },
    ];

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <span className="text-xl font-bold text-primary group-hover:scale-110 transition-transform">CodeFlow</span>
                    <span className="text-xl font-semibold text-gray-700 dark:text-gray-300 hidden sm:inline group-hover:scale-110 transition-transform">Solutions</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex flex-1 items-center justify-center">
                    <div className="flex items-center gap-12">
                        {menuItems.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-all duration-300 text-lg font-medium hover:scale-110"
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>
                </nav>

                {/* Actions - Desktop */}
                <div className="hidden md:flex items-center gap-4">
                    <ThemeToggle />
                    {/* <Button
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
                    </Button> */}
                    {/* {currentUser ? (
                        <Button asChild className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 text-sm sm:text-base">
                            <Link to="/dashboard">Acessar Dashboard</Link>
                        </Button>
                    ) : (
                        <>
                            <Button variant="outline" asChild className="border-2 transition-all duration-300 hover:scale-105 text-sm sm:text-base">
                                <Link to="/register">Criar Conta</Link>
                            </Button>
                            <Button asChild className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 text-sm sm:text-base">
                                <Link to="/login">Entrar</Link>
                            </Button>
                        </>
                    )} */}
                </div>

                {/* Actions - Mobile */}
                <div className="flex md:hidden items-center gap-2">
                    <ThemeToggle />
                    {/* {currentUser ? (
                        <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                            <Link to="/dashboard">Dashboard</Link>
                        </Button>
                    ) : (
                        <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                            <Link to="/login">Entrar</Link>
                        </Button>
                    )} */}
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-accent">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
                            <div className="flex flex-col h-full">
                                <SheetHeader className="p-4 border-b">
                                    <SheetTitle>Menu</SheetTitle>
                                    <SheetDescription className="sr-only">
                                        Menu de navegação do CodeFlow
                                    </SheetDescription>
                                </SheetHeader>

                                <div className="flex-1 py-6 px-4">
                                    <div className="flex flex-col gap-4">
                                        {menuItems.map((item) => (
                                            <a
                                                key={item.href}
                                                href={item.href}
                                                className="text-lg font-medium hover:text-primary transition-colors py-2"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                {item.label}
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t p-4 space-y-4">
                                    {/* <Button
                                        variant="ghost"
                                        size="icon"
                                        asChild
                                        className="w-full justify-start"
                                    >
                                        <a
                                            href="https://github.com/GabrielMacielZavarize/codeflow"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2"
                                        >
                                            <Github className="h-5 w-5" />
                                            <span>Ver no GitHub</span>
                                        </a>
                                    </Button> */}
                                    {/* {!currentUser && (
                                        <Button variant="outline" asChild className="w-full">
                                            <Link to="/register">Criar Conta</Link>
                                        </Button>
                                    )} */}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
};

export default Header; 