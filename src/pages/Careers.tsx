import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Briefcase, Users, Zap, Heart } from 'lucide-react';
import { useState, useRef } from 'react';
import { toast } from '@/components/ui/sonner';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';

const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { margin: "-100px" },
    transition: { duration: 0.8 }
};

const benefits = [
    {
        title: "Ambiente Inovador",
        description: "Trabalhe em um ambiente que valoriza a inovação e a criatividade.",
        icon: Zap
    },
    {
        title: "Equipe Diversa",
        description: "Faça parte de uma equipe diversa e multicultural.",
        icon: Users
    },
    {
        title: "Crescimento",
        description: "Oportunidades constantes de aprendizado e desenvolvimento.",
        icon: Heart
    }
];

const positions = [
    "Desenvolvedor Frontend",
    "Desenvolvedor Backend",
    "Designer UI/UX",
    "Product Manager",
    "QA Engineer",
    "DevOps Engineer"
];

const Careers = () => {
    const [loading, setLoading] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
        cargo: '',
        experiencia: '',
        formacao: '',
        portfolio: '',
        mensagem: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!formRef.current) return;

            // Envia os dados do formulário
            const templateParams = {
                from_name: formData.nome,
                from_email: formData.email,
                telefone: formData.telefone,
                cargo: formData.cargo,
                experiencia: formData.experiencia,
                formacao: formData.formacao,
                portfolio: formData.portfolio,
                mensagem: formData.mensagem
            };

            await emailjs.send(
                'service_4fjq8zh',
                'template_t4y821f',
                templateParams,
                'tK08-Dld5FlLtOhBz'
            );

            toast.success('Candidatura enviada com sucesso!');
            setFormData({
                nome: '',
                email: '',
                telefone: '',
                cargo: '',
                experiencia: '',
                formacao: '',
                portfolio: '',
                mensagem: ''
            });
        } catch (error) {
            console.error('Erro ao enviar e-mail:', error);
            toast.error('Erro ao enviar candidatura. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

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
                        <Briefcase className="w-4 h-4 mr-2" />
                        Trabalhe Conosco
                    </motion.span>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                        Faça Parte do Nosso Time
                    </h1>
                    <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg max-w-[700px] mx-auto">
                        Junte-se a nós e ajude a construir o futuro do desenvolvimento de software
                    </p>
                </motion.div>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Formulário de Candidatura */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ margin: "-100px" }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-primary/20">
                            <CardContent className="p-6">
                                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="nome">Nome Completo</Label>
                                            <Input
                                                id="nome"
                                                value={formData.nome}
                                                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                                                required
                                                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">E-mail</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                                required
                                                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="telefone">Telefone</Label>
                                            <Input
                                                id="telefone"
                                                type="tel"
                                                value={formData.telefone}
                                                onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                                                required
                                                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="cargo">Cargo Desejado</Label>
                                            <Select
                                                value={formData.cargo}
                                                onValueChange={(value) => setFormData(prev => ({ ...prev, cargo: value }))}
                                            >
                                                <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                    <SelectValue placeholder="Selecione o cargo" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {positions.map((position) => (
                                                        <SelectItem key={position} value={position}>
                                                            {position}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="experiencia">Experiência Profissional</Label>
                                        <Textarea
                                            id="experiencia"
                                            value={formData.experiencia}
                                            onChange={(e) => setFormData(prev => ({ ...prev, experiencia: e.target.value }))}
                                            required
                                            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            placeholder="Descreva suas experiências profissionais relevantes"
                                            rows={4}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="formacao">Formação Acadêmica</Label>
                                        <Textarea
                                            id="formacao"
                                            value={formData.formacao}
                                            onChange={(e) => setFormData(prev => ({ ...prev, formacao: e.target.value }))}
                                            required
                                            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            placeholder="Descreva sua formação acadêmica"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="portfolio">Portfólio/GitHub</Label>
                                        <Input
                                            id="portfolio"
                                            type="url"
                                            value={formData.portfolio}
                                            onChange={(e) => setFormData(prev => ({ ...prev, portfolio: e.target.value }))}
                                            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            placeholder="Link do seu portfólio ou GitHub"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="mensagem">Por que você quer trabalhar conosco?</Label>
                                        <Textarea
                                            id="mensagem"
                                            value={formData.mensagem}
                                            onChange={(e) => setFormData(prev => ({ ...prev, mensagem: e.target.value }))}
                                            required
                                            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            placeholder="Conte-nos por que você seria um ótimo fit para nossa equipe"
                                            rows={4}
                                        />
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            asChild
                                            className="dark:border-gray-600"
                                        >
                                            <Link to="/">Cancelar</Link>
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="bg-primary hover:bg-primary/90"
                                        >
                                            {loading ? 'Enviando...' : 'Enviar Candidatura'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Benefícios */}
                    <div className="space-y-8">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ margin: "-100px" }}
                            className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300"
                        >
                            Por que trabalhar conosco?
                        </motion.h2>

                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={benefit.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ margin: "-100px" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card className="hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-primary/20">
                                    <CardContent className="p-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="p-3 rounded-full bg-primary/10">
                                                <benefit.icon className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                                                    {benefit.title}
                                                </h3>
                                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                                    {benefit.description}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Careers; 