import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { tarefasService } from '@/lib/firebase/tarefas';
import { toast } from '@/components/ui/sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export const AdicionarTarefa = () => {
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();
    const { t } = useLanguage();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!titulo.trim()) {
            toast.error(t.tasks.tituloObrigatorio);
            return;
        }

        if (!currentUser) {
            toast.error(t.tasks.usuarioNaoAutenticado);
            return;
        }

        setLoading(true);

        try {
            await tarefasService.criarTarefa({
                titulo: titulo.trim(),
                descricao: descricao.trim(),
                concluida: false,
                userId: currentUser.uid,
                userEmail: currentUser.email || '',
                dataInicio: new Date(),
                dataFim: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias a partir de agora
                responsavelId: currentUser.uid,
                responsavelNome: currentUser.displayName || currentUser.email || '',
                status: 'pendente'
            });

            setTitulo('');
            setDescricao('');
            toast.success(t.tasks.criadaComSucesso);
        } catch (error) {
            console.error('Erro ao criar tarefa:', error);
            toast.error(t.tasks.erroAoCriar);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t.tasks.adicionarNova}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            type="text"
                            placeholder={t.tasks.tituloPlaceholder}
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Textarea
                            placeholder={t.tasks.descricaoPlaceholder}
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <Button type="submit" disabled={loading}>
                        {loading ? t.tasks.adicionando : t.tasks.adicionar}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}; 