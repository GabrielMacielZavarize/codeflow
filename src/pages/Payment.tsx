import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const plans = {
    basic: {
        name: "Básico",
        price: 0,
        description: "Perfeito para freelancers e pequenos projetos"
    },
    plus: {
        name: "Plus",
        price: 49.90,
        description: "Ideal para agências e projetos em crescimento"
    },
    pro: {
        name: "Pro",
        price: 99.90,
        description: "Solução completa para grandes empresas"
    }
};

const Payment = () => {
    const { planId } = useParams();
    const navigate = useNavigate();

    const selectedPlan = plans[planId as keyof typeof plans];

    if (!selectedPlan) {
        navigate('/');
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
            <div className="container max-w-2xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="border-primary/20 backdrop-blur-sm bg-white/50 dark:bg-gray-900/50">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-center">
                                Plano {selectedPlan.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="text-center space-y-4">
                                <p className="text-gray-600 dark:text-gray-400">
                                    Obrigado pelo seu interesse em nosso plano {selectedPlan.name}!
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">
                                    No momento, estamos trabalhando na implementação do sistema de pagamentos.
                                    Em breve, você poderá assinar este plano e aproveitar todos os benefícios.
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Para mais informações, entre em contato conosco através do email: gabrielmzavarze@gmail.com
                                </p>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600 dark:text-gray-400">Valor do Plano</span>
                                    <span className="font-medium">R$ {selectedPlan.price.toFixed(2)}</span>
                                </div>
                            </div>

                            <Button
                                onClick={() => navigate('/')}
                                className="w-full"
                                variant="outline"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Voltar para a Página Inicial
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default Payment; 