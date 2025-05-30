import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        name: "Carlos Mendes",
        role: "Tech Lead",
        company: "TechCorp",
        image: "https://github.com/carlosmendes.png",
        rating: 5,
        comment: "O CodeFlow revolucionou nossa forma de trabalhar. A plataforma é intuitiva e as funcionalidades são exatamente o que precisávamos."
    },
    {
        name: "Juliana Alves",
        role: "Product Manager",
        company: "InovaçãoTech",
        image: "https://github.com/julianaalves.png",
        rating: 5,
        comment: "A experiência com o CodeFlow tem sido incrível. O suporte é excepcional e as atualizações constantes mostram o compromisso com a qualidade."
    },
    {
        name: "Ricardo Souza",
        role: "CTO",
        company: "DevSolutions",
        image: "https://github.com/ricardosouza.png",
        rating: 5,
        comment: "Implementamos o CodeFlow em toda nossa equipe e os resultados foram surpreendentes. A produtividade aumentou significativamente."
    }
];

const TestimonialsSection = () => {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (!isHovered) {
            const interval = setInterval(() => {
                setCurrentTestimonial((prev) => {
                    const next = prev + direction;
                    if (next >= testimonials.length) {
                        setDirection(-1);
                        return prev - 1;
                    }
                    if (next < 0) {
                        setDirection(1);
                        return prev + 1;
                    }
                    return next;
                });
            }, 8000); // Muda a cada 8 segundos

            return () => clearInterval(interval);
        }
    }, [direction, isHovered]);

    return (
        <section className="relative py-24 overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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

            <div className="container px-4 mx-auto relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ margin: "-100px" }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                        O que nossos clientes dizem
                    </h2>
                </motion.div>

                <div
                    className="relative max-w-4xl mx-auto"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentTestimonial}
                            initial={{
                                opacity: 0,
                                scale: 0.8,
                                x: direction * 100,
                                rotateY: direction * 45
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                x: 0,
                                rotateY: 0
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.8,
                                x: -direction * 100,
                                rotateY: -direction * 45
                            }}
                            transition={{
                                duration: 0.8,
                                ease: "easeInOut"
                            }}
                            className="relative perspective-1000"
                        >
                            <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-primary/20 transform-gpu">
                                <CardContent className="p-8">
                                    <div className="flex flex-col items-center text-center space-y-6">
                                        <motion.div
                                            className="relative w-24 h-24"
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full blur-xl"></div>
                                            <img
                                                src={testimonials[currentTestimonial].image}
                                                alt={testimonials[currentTestimonial].name}
                                                className="relative w-full h-full rounded-full object-cover border-4 border-primary/20"
                                            />
                                            <motion.div
                                                className="absolute -top-2 -right-2 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                <Quote className="w-4 h-4 text-primary" />
                                            </motion.div>
                                        </motion.div>

                                        <motion.div
                                            className="flex items-center gap-1"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: 0.4 + i * 0.1 }}
                                                >
                                                    <Star className="w-6 h-6 fill-primary text-primary" />
                                                </motion.div>
                                            ))}
                                        </motion.div>

                                        <motion.p
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="text-xl text-gray-600 dark:text-gray-400 italic leading-relaxed"
                                        >
                                            "{testimonials[currentTestimonial].comment}"
                                        </motion.p>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6 }}
                                        >
                                            <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                                                {testimonials[currentTestimonial].name}
                                            </h3>
                                            <p className="text-sm text-primary mt-1">
                                                {testimonials[currentTestimonial].role} - {testimonials[currentTestimonial].company}
                                            </p>
                                        </motion.div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </AnimatePresence>

                    {/* Indicadores */}
                    <div className="flex justify-center gap-3 mt-8">
                        {testimonials.map((_, index) => (
                            <motion.button
                                key={index}
                                onClick={() => {
                                    setDirection(index > currentTestimonial ? 1 : -1);
                                    setCurrentTestimonial(index);
                                }}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                className={`h-2 rounded-full transition-all duration-300 ${index === currentTestimonial
                                    ? "bg-primary w-8"
                                    : "bg-gray-300 dark:bg-gray-700 w-2"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection; 