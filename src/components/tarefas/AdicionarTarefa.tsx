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
            toast.error(t.tarefas.tituloObrigatorio);
            return;
        }

        if (!currentUser) {
            toast.error(t.tarefas.usuarioNaoAutenticado);
            return;
        }

        setLoading(true);

        try {
            await tarefasService.criarTarefa({
                titulo: titulo.trim(),
                descricao: descricao.trim(),
                concluida: false,
                userId: currentUser.uid
            });

            setTitulo('');
            setDescricao('');
            toast.success(t.tarefas.criadaComSucesso);
        } catch (error) {
            console.error('Erro ao criar tarefa:', error);
            toast.error(t.tarefas.erroAoCriar);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t.tarefas.adicionarNova}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            type="text"
                            placeholder={t.tarefas.tituloPlaceholder}
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Textarea
                            placeholder={t.tarefas.descricaoPlaceholder}
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <Button type="submit" disabled={loading}>
                        {loading ? t.tarefas.adicionando : t.tarefas.adicionar}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}; 