import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Shield, Lock, Scale } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { margin: "-100px" },
    transition: { duration: 0.8 }
};

const terms = [
    {
        title: "Aceitação dos Termos",
        description: "Ao acessar e usar o CodeFlow Solutions, você concorda em cumprir estes termos de uso. Se você não concordar com qualquer parte destes termos, não poderá acessar o serviço.",
        icon: FileText
    },
    {
        title: "Uso do Serviço",
        description: "O CodeFlow Solutions é uma plataforma de gestão de tarefas e projetos. Você concorda em usar o serviço apenas para fins legais e de acordo com estes termos.",
        icon: Shield
    },
    {
        title: "Contas de Usuário",
        description: "Ao criar uma conta, você é responsável por manter a confidencialidade de suas credenciais e por todas as atividades que ocorrem em sua conta.",
        icon: Lock
    },
    {
        title: "Propriedade Intelectual",
        description: "Todo o conteúdo, funcionalidades e design do CodeFlow Solutions são protegidos por direitos autorais e outras leis de propriedade intelectual.",
        icon: Scale
    }
];

const Terms = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="container px-4 py-8 sm:px-8">
                <Button variant="ghost" asChild className="mb-8">
                    <Link to="/" className="flex items-center gap-2">
                        <ArrowLeft size={20} />
                        Voltar para Home
                    </Link>
                </Button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-primary/20 to-primary/10 text-primary mb-4 backdrop-blur-sm border border-primary/20"
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        Termos de Uso
                    </motion.span>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                        Termos de Uso
                    </h1>
                    <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg max-w-[700px] mx-auto">
                        Conheça os termos e condições que regem o uso da nossa plataforma
                    </p>
                </motion.div>

                <div className="grid gap-8 md:grid-cols-2">
                    {terms.map((term, index) => (
                        <motion.div
                            key={term.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ margin: "-100px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="h-full hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-primary/20">
                                <CardContent className="p-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="p-3 rounded-full bg-primary/10">
                                            <term.icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                                                {term.title}
                                            </h3>
                                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                                {term.description}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ margin: "-100px" }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-16 text-center"
                >
                    <p className="text-gray-600 dark:text-gray-400">
                        Última atualização: {new Date().toLocaleDateString('pt-BR')}
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Terms; 