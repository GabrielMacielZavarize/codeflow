import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Star, ArrowRight, Sparkles } from 'lucide-react';
import TypewriterText from '@/components/TypewriterText';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { PWAInstallButton } from '../PWAInstallButton';
import { useLanguage } from '@/contexts/LanguageContext';

const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { margin: "-100px" },
    transition: { duration: 0.8 }
};

const fadeInLeft = {
    initial: { opacity: 0, x: -60 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { margin: "-100px" },
    transition: { duration: 0.8 }
};

const fadeInRight = {
    initial: { opacity: 0, x: 60 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { margin: "-100px" },
    transition: { duration: 0.8 }
};

const stats = [
    {
        value: "50+",
        label: "Empresas"
    },
    {
        value: "100+",
        label: "Projetos"
    },
    {
        value: "1.000+",
        label: "Usuários"
    },
    {
        value: "5",
        label: "Estados"
    }
];

const HeroSection = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const { t } = useLanguage();

    const scrollToBeta = () => {
        const betaSection = document.getElementById('beta-section');
        if (betaSection) {
            betaSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-12">
            {/* Efeitos de fundo */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-30 blur-3xl"></div>

            {/* Partículas animadas */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-primary/20 rounded-full"
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                        }}
                        animate={{
                            y: [0, -100],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            <div className="container px-4 sm:px-8 relative z-10">
                <div className="max-w-[1000px] mx-auto text-center">
                    <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ margin: "-100px" }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-primary/20 to-primary/10 text-primary mb-3 backdrop-blur-sm border border-primary/20"
                    >
                        <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                        Bem-vindo ao CodeFlow
                    </motion.span>

                    <motion.h1
                        {...fadeInUp}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 mb-3"
                    >
                        Transforme sua Gestão de Projetos
                    </motion.h1>

                    <motion.p
                        {...fadeInUp}
                        transition={{ delay: 0.2 }}
                        className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-[800px] mx-auto"
                    >
                        Priorize tarefas, otimize recursos e entregue projetos com excelência usando nossa solução inteligente.
                    </motion.p>

                    <motion.div
                        {...fadeInUp}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Button
                            size="lg"
                            onClick={scrollToBeta}
                            className="group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white"
                        >
                            Inscreva-se para a Versão Beta
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </motion.div>

                    {/* <motion.div
                        {...fadeInUp}
                        transition={{ delay: 0.6 }}
                        className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-8"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 * index }}
                                className="flex flex-col items-center justify-center space-y-2 rounded-lg border p-4 shadow-sm"
                            >
                                <div className="text-3xl font-bold">{stat.value}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div> */}
                </div>
            </div>
        </section>
    );
};

export default HeroSection; 