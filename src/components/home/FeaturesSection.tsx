import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Zap, Users, Code, Sparkles } from 'lucide-react';

const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { margin: "-100px" },
    transition: { duration: 0.8 }
};

const features = [
    {
        title: "Priorização Inteligente",
        description: "Organize tarefas por impacto e esforço para maximizar produtividade.",
        icon: <Star className="h-6 w-6 text-primary" />
    },
    {
        title: "Análise de Desempenho",
        description: "Visualize métricas de entrega e evolução de projetos em tempo real.",
        icon: <Zap className="h-6 w-6 text-primary" />
    },
    {
        title: "Gestão de Equipes",
        description: "Distribua recursos e acompanhe o desempenho de cada colaborador.",
        icon: <Users className="h-6 w-6 text-primary" />
    },
    {
        title: "Automação de Processos",
        description: "Reduza tarefas manuais com fluxos de trabalho inteligentes.",
        icon: <Code className="h-6 w-6 text-primary" />
    },
    {
        title: "Relatórios Customizados",
        description: "Gere insights valiosos sobre projetos e entregas.",
        icon: <Star className="h-6 w-6 text-primary" />
    },
    {
        title: "Integração Completa",
        description: "Conecte-se facilmente com suas ferramentas de trabalho favoritas.",
        icon: <Zap className="h-6 w-6 text-primary" />
    }
];

const FeaturesSection = () => {
    return (
        <section id="funcionalidades" className="relative container px-4 py-8 sm:py-12 md:py-24 sm:px-8 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
            {/* Efeitos de fundo */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-30 blur-3xl"></div>

            <div className="mx-auto text-center mb-8 sm:mb-12 relative">
                <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-primary/20 to-primary/10 text-primary mb-4 backdrop-blur-sm border border-primary/20"
                >
                    <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                    Funcionalidades
                </motion.span>
                <motion.h2
                    {...fadeInUp}
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300"
                >
                    Funcionalidades Principais
                </motion.h2>
                <motion.p
                    {...fadeInUp}
                    transition={{ delay: 0.2 }}
                    className="mt-4 text-gray-600 dark:text-gray-400 text-base sm:text-lg md:text-xl max-w-[700px] mx-auto"
                >
                    Nossa solução oferece ferramentas completas para otimizar seu fluxo de trabalho
                    e maximizar os resultados da sua equipe.
                </motion.p>
            </div>

            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 relative">
                {features.map((feature, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ margin: "-100px" }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="h-full"
                    >
                        <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-primary/20 group">
                            <CardContent className="p-6 space-y-4 h-full flex flex-col">
                                <div className="rounded-full bg-gradient-to-r from-primary/20 to-primary/10 w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                                    {feature.title}
                                </h3>
                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 flex-grow">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default FeaturesSection; 