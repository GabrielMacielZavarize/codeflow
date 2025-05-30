import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="relative border-t border-gray-200 dark:border-gray-800 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
            {/* Efeitos de fundo */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-30 blur-3xl"></div>

            <div className="container px-4 py-6 sm:py-8 md:py-12 sm:px-8 relative">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                        <span className="text-base sm:text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                            CodeFlow Solutions
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            © {new Date().getFullYear()} Todos os direitos reservados
                        </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                        <Link to="/terms" className="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">
                            Termos de Uso
                        </Link>
                        <Link to="/privacy" className="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">
                            Privacidade
                        </Link>
                        <Link to="/careers" className="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">
                            Trabalhe Conosco
                        </Link>
                        <a href="mailto:gabrielmzavarize@gmail.com" className="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">
                            Contato
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 