import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowRight, Github } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const plans = [
    {
        name: "Básico",
        description: "Perfeito para freelancers e pequenos projetos",
        price: "Grátis",
        features: [
            "Acesso a todas as funcionalidades principais",
            "Criação de tarefas ilimitadas",
            "Atualizações em tempo real",
            "1 projeto ativo",
            "Tarefas Rápidas feita com IA (Limite 10 requisições diárias)",
            "Criação de Relatórios com IA (Limite de 5 requisições mensais)"
        ],
        buttonText: "Disponível em Breve",
        buttonIcon: ArrowRight,
        buttonLink: "#",
        popular: false
    },
    {
        name: "Plus",
        description: "Ideal para agências e projetos em crescimento",
        price: "R$ 49,90",
        features: [
            "Todas as features do Básico",
            "Suporte prioritário",
            "5 projetos ativos",
            "Personalização de temas",
            "Integração com APIs populares",
            "Tarefas Rápidas feita com IA (Limite 30 requisições diárias)",
            "Criação de Relatórios com IA (Limite de 15 requisições mensais)"
        ],
        buttonText: "Disponível em Breve",
        buttonIcon: ArrowRight,
        buttonLink: "#",
        popular: true
    },
    {
        name: "Pro",
        description: "Solução completa para grandes empresas",
        price: "R$ 99,90",
        features: [
            "Todas as features do Plus",
            "Tarefas Rápidas feita com IA (Ilimitado)",
            "Criação de Relatórios com IA (Ilimitado)",
            "Projetos ilimitados",
            "Personalização avançada",
            "Treinamento da equipe (Desconto em plataformas de educação)"
        ],
        buttonText: "Disponível em Breve",
        buttonIcon: ArrowRight,
        buttonLink: "#",
        popular: false
    }
];

const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { margin: "-100px" },
    transition: { duration: 0.8 }
};

export function Pricing() {
    return (
        <section className="py-20 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="container px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ margin: "-100px" }}
                    className="text-center mb-16"
                >
                    <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ margin: "-100px" }}
                        className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-primary/20 to-primary/10 text-primary mb-4 backdrop-blur-sm border border-primary/20"
                    >
                        Planos
                    </motion.span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 mb-4">
                        Escolha o Plano Ideal para Você
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg max-w-[700px] mx-auto">
                        Comece gratuitamente e evolua conforme seu negócio cresce
                    </p>
                </motion.div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ margin: "-100px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className={`h-full backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-primary/20 ${plan.popular ? 'ring-2 ring-primary' : ''} flex flex-col`}>
                                <CardHeader>
                                    {plan.popular && (
                                        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
                                            Mais Popular
                                        </div>
                                    )}
                                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                                    <CardDescription className="text-gray-600 dark:text-gray-400">
                                        {plan.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <div className="mb-6">
                                        <span className="text-4xl font-bold">{plan.price}</span>
                                        {plan.price !== "Grátis" && (
                                            <span className="text-gray-600 dark:text-gray-400">/mês</span>
                                        )}
                                    </div>
                                    <ul className="space-y-3">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-center gap-2">
                                                <Check className="w-4 h-4 text-primary" />
                                                <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter className="mt-auto">
                                    <Button
                                        disabled
                                        className={`w-full opacity-75 cursor-not-allowed ${plan.popular ? 'bg-primary/50 hover:bg-primary/50' : 'bg-gray-400 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-600'}`}
                                    >
                                        {plan.buttonText}
                                        <plan.buttonIcon className="ml-2 h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
} 