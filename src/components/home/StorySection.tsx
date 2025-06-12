import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Code, Sparkles, ArrowRight, FileText, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

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

const StorySection = () => {
    return (
        <section id="historia" className="relative container px-4 py-8 sm:py-12 md:py-24 sm:px-8 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
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

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ margin: "-100px" }}
                transition={{ duration: 1 }}
                className="mx-auto max-w-[1000px] relative"
            >
                <div className="text-center mb-8 sm:mb-12">
                    <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ margin: "-100px" }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-primary/20 to-primary/10 text-primary mb-4 backdrop-blur-sm border border-primary/20 hover:scale-105 transition-transform"
                    >
                        <Clock className="w-4 h-4 mr-2 animate-pulse" />
                        Nossa História
                    </motion.span>
                    <motion.h2
                        {...fadeInUp}
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300"
                    >
                        Transformando a Gestão de Projetos
                    </motion.h2>
                    <motion.p
                        {...fadeInUp}
                        transition={{ delay: 0.2 }}
                        className="mt-4 text-gray-600 dark:text-gray-400 text-base sm:text-lg md:text-xl"
                    >
                        Nascemos em 2025 com uma missão clara: revolucionar a gestão de projetos com tecnologia inteligente e soluções inovadoras.
                    </motion.p>
                </div>

                <div className="space-y-8">
                    <motion.div
                        {...fadeInLeft}
                        className="space-y-4 sm:space-y-6"
                    >
                        <h3 className="text-xl sm:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                            O Desafio
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                            Identificamos que as empresas enfrentam atrasos frequentes na entrega de sistemas e aplicações,
                            devido a falhas na gestão de projetos e alocação de recursos. A ausência de um sistema eficiente
                            para priorizar tarefas e demandas contribui para prazos mal calculados e dificuldades na adaptação
                            a mudanças de requisitos.
                        </p>
                    </motion.div>

                    <motion.div
                        {...fadeInRight}
                        className="space-y-4 sm:space-y-6"
                    >
                        <h3 className="text-xl sm:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                            Nossa Solução
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                            Criamos um sistema de priorização que ajuda a otimizar o planejamento, distribuindo recursos
                            de forma mais estratégica. Isso impacta diretamente na qualidade das entregas, evitando retrabalhos,
                            melhorando a reputação da empresa e diminuindo perdas contratuais.
                        </p>
                    </motion.div>

                    <motion.div
                        {...fadeInUp}
                        className="space-y-4 sm:space-y-6"
                    >
                        <h3 className="text-xl sm:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                            Nossos Diferenciais
                        </h3>
                        <div className="grid gap-6 sm:grid-cols-2">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ margin: "-100px" }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <Card className="hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-primary/20 group">
                                    <CardContent className="p-6 space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="rounded-full bg-gradient-to-r from-primary/20 to-primary/10 w-12 h-12 flex items-center justify-center">
                                                <FileText className="h-6 w-6 text-primary" />
                                            </div>
                                            <h4 className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                                                Sistema de Tarefas Rápidas
                                            </h4>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                                            Uma ideia rápida, uma tarefa pronta. Nossa IA transforma texto em tarefas claras e organizadas.
                                        </p>
                                        <Link to="/open-source" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
                                            Saiba mais
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Link>
                                    </CardContent>
                                </Card>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ margin: "-100px" }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <Card className="hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-primary/20 group">
                                    <CardContent className="p-6 space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="rounded-full bg-gradient-to-r from-primary/20 to-primary/10 w-12 h-12 flex items-center justify-center">
                                                <Bot className="h-6 w-6 text-primary" />
                                            </div>
                                            <h4 className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                                                Suporte IA 24/7
                                            </h4>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                                            Assistente virtual disponível 24 horas por dia para ajudar com suas dúvidas.
                                        </p>
                                        <Link to="/ai-support" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
                                            Saiba mais
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Link>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default StorySection; 