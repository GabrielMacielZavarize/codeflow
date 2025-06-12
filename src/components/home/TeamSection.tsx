import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Github, Linkedin } from 'lucide-react';

const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { margin: "-100px" },
    transition: { duration: 0.8 }
};

const teamMembers = [
    {
        name: "Gabriel Maciel",
        role: "Desenvolvedor FrontEnd",
        image: "https://github.com/GabrielMacielZavarize.png",
        github: "https://github.com/GabrielMacielZavarize",
        linkedin: "https://linkedin.com/in/gabrielmacielzavarize"
    },
    {
        name: "Pedro Henrique",
        role: "Desenvolvedor Backend",
        image: "https://github.com/PedroHarter.png",
        github: "https://github.com/PedroHarter",
        linkedin: "https://linkedin.com/in/pedroharter"
    },
    {
        name: "Wilian Vieira",
        role: "Designer",
        image: "https://github.com/WilianVieiraF.png",
        github: "https://github.com/WilianVieiraF",
        linkedin: "https://linkedin.com/in/wilianvieira"
    },
    {
        name: "Alexandre",
        role: "Product Manager",
        image: "https://github.com/xandetds.png",
        github: "https://github.com/xandetds",
        linkedin: "https://linkedin.com/in/xandetds"
    },
    {
        name: "Pedro Canto",
        role: "QA Engineer",
        image: "https://github.com/PedroCanto.png",
        github: "https://github.com/PedroCanto",
        linkedin: "https://linkedin.com/in/pedrocanto"
    }
];

const TeamSection = () => {
    return (
        <section id="equipe" className="relative container px-4 py-8 sm:py-12 md:py-24 sm:px-8 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
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
                className="mx-auto max-w-[1200px] relative"
            >
                <div className="text-center mb-12 sm:mb-16">
                    <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ margin: "-100px" }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-primary/20 to-primary/10 text-primary mb-4 backdrop-blur-sm border border-primary/20 hover:scale-105 transition-transform"
                    >
                        <Users className="w-4 h-4 mr-2 animate-pulse" />
                        Nossa Equipe
                    </motion.span>
                    <motion.h2
                        {...fadeInUp}
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300"
                    >
                        Conheça Nossa Equipe
                    </motion.h2>
                    <motion.p
                        {...fadeInUp}
                        transition={{ delay: 0.2 }}
                        className="mt-4 text-gray-600 dark:text-gray-400 text-base sm:text-lg md:text-xl max-w-[700px] mx-auto"
                    >
                        Profissionais apaixonados por tecnologia e inovação, trabalhando juntos para criar soluções incríveis
                    </motion.p>
                </div>

                {/* Grid de membros da equipe */}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {teamMembers.map((member, index) => (
                        <motion.div
                            key={member.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ margin: "-100px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="h-full"
                        >
                            <Card className="h-full hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-primary/20 group">
                                <CardContent className="p-6 space-y-6 h-full flex flex-col items-center">
                                    <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="relative w-full h-full rounded-full object-cover border-4 border-primary/20 group-hover:border-primary/40 transition-all"
                                        />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                                            {member.name}
                                        </h3>
                                        <p className="text-sm text-primary font-medium">{member.role}</p>
                                    </div>
                                    {/* <div className="flex items-center gap-4 mt-4">
                                        <a
                                            href={member.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary/10 transition-colors"
                                        >
                                            <Github className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                        </a>
                                        <a
                                            href={member.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary/10 transition-colors"
                                        >
                                            <Linkedin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                        </a>
                                    </div> */}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default TeamSection; 