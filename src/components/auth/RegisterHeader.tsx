import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const RegisterHeader = () => {
    return (
        <>
            <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Button variant="ghost" asChild className="mb-8 hover:scale-105 transition-all duration-300">
                    <Link to="/" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                        <ArrowLeft size={20} />
                        Voltar para Home
                    </Link>
                </Button>
            </motion.div>

            <motion.div
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.1
                        }
                    }
                }}
                initial="hidden"
                animate="visible"
                className="mb-8 text-center"
            >
                <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="inline-block mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary dark:bg-primary/20">
                        <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                        Solução Open Source
                    </span>
                </motion.div>
                <motion.h1 variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="text-3xl font-bold text-gray-900 dark:text-white">
                    CodeFlow Solutions
                </motion.h1>
                <motion.p variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="mt-2 text-gray-600 dark:text-gray-300">
                    Crie sua conta e comece a gerenciar seus projetos
                </motion.p>
            </motion.div>
        </>
    );
};

export default RegisterHeader; 