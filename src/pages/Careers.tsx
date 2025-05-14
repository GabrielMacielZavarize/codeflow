import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/components/ui/sonner';

const Careers = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
        cargo: '',
        experiencia: '',
        formacao: '',
        portfolio: '',
        mensagem: '',
        curriculo: null as File | null
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Aqui você implementaria a lógica de envio do formulário
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulação de envio
            toast.success('Candidatura enviada com sucesso!');
            setFormData({
                nome: '',
                email: '',
                telefone: '',
                cargo: '',
                experiencia: '',
                formacao: '',
                portfolio: '',
                mensagem: '',
                curriculo: null
            });
        } catch (error) {
            toast.error('Erro ao enviar candidatura. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, curriculo: file }));
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <div className="container px-4 py-8 sm:px-8">
                <Button variant="ghost" asChild className="mb-8">
                    <Link to="/" className="flex items-center gap-2">
                        <ArrowLeft size={20} />
                        Voltar para Home
                    </Link>
                </Button>

                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Trabalhe Conosco
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            Junte-se à nossa equipe e faça parte de uma empresa inovadora
                        </p>
                    </div>

                    <Card className="dark:bg-gray-800 dark:border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-2xl text-center text-gray-900 dark:text-white">
                                Formulário de Candidatura
                            </CardTitle>
                            <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                                Preencha o formulário abaixo para se candidatar a uma vaga em nossa empresa
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
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
                                                <SelectItem value="desenvolvedor-frontend">Desenvolvedor Frontend</SelectItem>
                                                <SelectItem value="desenvolvedor-backend">Desenvolvedor Backend</SelectItem>
                                                <SelectItem value="desenvolvedor-fullstack">Desenvolvedor Fullstack</SelectItem>
                                                <SelectItem value="designer-ui-ux">Designer UI/UX</SelectItem>
                                                <SelectItem value="analista-qa">Analista QA</SelectItem>
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

                                <div className="space-y-2">
                                    <Label htmlFor="curriculo">Currículo (PDF)</Label>
                                    <div className="flex items-center gap-4">
                                        <Input
                                            id="curriculo"
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                        {formData.curriculo && (
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {formData.curriculo.name}
                                            </span>
                                        )}
                                    </div>
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
                </div>
            </div>
        </div>
    );
};

export default Careers; 