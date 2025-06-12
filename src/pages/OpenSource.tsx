import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bot, Sparkles, Code2, MessageSquare, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { margin: "-100px" },
    transition: { duration: 0.8 }
};

const OpenSource = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Efeitos de fundo */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-30 blur-3xl"></div>

            <div className="container px-4 py-8 sm:py-12 md:py-24 sm:px-8 relative">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                >
                    <Button variant="ghost" asChild className="mb-8">
                        <Link to="/" className="flex items-center">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar
                        </Link>
                    </Button>
                </motion.div>

                <div className="max-w-[1000px] mx-auto">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ margin: "-100px" }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-primary/20 to-primary/10 text-primary mb-4 backdrop-blur-sm border border-primary/20"
                    >
                        <Bot className="w-4 h-4 mr-2" />
                        Transformação Inteligente
                    </motion.div>

                    <motion.h1
                        {...fadeInUp}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 mb-6"
                    >
                        Texto em Tarefas, Instantaneamente
                    </motion.h1>

                    <motion.p
                        {...fadeInUp}
                        transition={{ delay: 0.2 }}
                        className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-12"
                    >
                        Nossa IA transforma suas ideias em tarefas estruturadas e organizadas, facilitando o gerenciamento de projetos.
                    </motion.p>

                    <div className="grid gap-8 sm:grid-cols-2 mb-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ margin: "-100px" }}
                            transition={{ duration: 0.5 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className="rounded-full bg-gradient-to-r from-primary/20 to-primary/10 w-12 h-12 flex items-center justify-center">
                                    <MessageSquare className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                                    Entrada Natural
                                </h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Escreva suas ideias em linguagem natural e nossa IA as transforma em tarefas estruturadas.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ margin: "-100px" }}
                            transition={{ duration: 0.5 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className="rounded-full bg-gradient-to-r from-primary/20 to-primary/10 w-12 h-12 flex items-center justify-center">
                                    <Sparkles className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                                    Organização Automática
                                </h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Tarefas organizadas automaticamente com prioridades, prazos e responsáveis.
                            </p>
                        </motion.div>
                    </div>

                    <motion.div
                        {...fadeInUp}
                        className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-primary/20 rounded-xl p-6 sm:p-8 mb-12"
                    >
                        <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                            Como Funciona
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="rounded-full bg-gradient-to-r from-primary/20 to-primary/10 w-8 h-8 flex items-center justify-center mt-1">
                                    <MessageSquare className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">1. Digite sua Ideia</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Escreva sua ideia ou requisito em linguagem natural, como você faria em uma conversa.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="rounded-full bg-gradient-to-r from-primary/20 to-primary/10 w-8 h-8 flex items-center justify-center mt-1">
                                    <Bot className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">2. IA Processa</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Nossa IA analisa o texto e extrai informações relevantes para criar tarefas estruturadas.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="rounded-full bg-gradient-to-r from-primary/20 to-primary/10 w-8 h-8 flex items-center justify-center mt-1">
                                    <Zap className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">3. Tarefas Prontas</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Receba suas tarefas organizadas e prontas para serem atribuídas e executadas.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        {...fadeInUp}
                        className="text-center"
                    >
                        <Button size="lg" asChild className="group">
                            <Link to="/try-now">
                                Experimentar Agora
                                <Zap className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default OpenSource; 