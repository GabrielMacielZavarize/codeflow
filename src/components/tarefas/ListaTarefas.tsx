import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { tarefasService, Tarefa } from '@/lib/firebase/tarefas';
import { toast } from '@/components/ui/sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { Trash2 } from 'lucide-react';

export const ListaTarefas = () => {
    const [tarefas, setTarefas] = useState<Tarefa[]>([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();
    const { t } = useLanguage();

    const carregarTarefas = async () => {
        if (!currentUser) return;

        try {
            const tarefasUsuario = await tarefasService.buscarTarefasUsuario(currentUser.uid);
            setTarefas(tarefasUsuario as Tarefa[]);
        } catch (error) {
            console.error('Erro ao carregar tarefas:', error);
            toast.error(t.tarefas.erroAoCarregar);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarTarefas();
    }, [currentUser]);

    const handleToggleConcluida = async (tarefa: Tarefa) => {
        if (!tarefa.id) return;

        try {
            await tarefasService.atualizarTarefa(tarefa.id, {
                concluida: !tarefa.concluida
            });
            await carregarTarefas();
            toast.success(t.tarefas.atualizadaComSucesso);
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
            toast.error(t.tarefas.erroAoAtualizar);
        }
    };

    const handleDeletar = async (tarefaId: string) => {
        try {
            await tarefasService.deletarTarefa(tarefaId);
            await carregarTarefas();
            toast.success(t.tarefas.deletadaComSucesso);
        } catch (error) {
            console.error('Erro ao deletar tarefa:', error);
            toast.error(t.tarefas.erroAoDeletar);
        }
    };

    if (loading) {
        return <div>{t.tarefas.carregando}</div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t.tarefas.minhasTarefas}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {tarefas.length === 0 ? (
                        <p className="text-center text-muted-foreground">
                            {t.tarefas.nenhumaTarefa}
                        </p>
                    ) : (
                        tarefas.map((tarefa) => (
                            <div
                                key={tarefa.id}
                                className="flex items-center justify-between p-4 border rounded-lg"
                            >
                                <div className="flex items-center space-x-4">
                                    <Checkbox
                                        checked={tarefa.concluida}
                                        onCheckedChange={() => handleToggleConcluida(tarefa)}
                                    />
                                    <div>
                                        <h3 className={`font-medium ${tarefa.concluida ? 'line-through text-muted-foreground' : ''}`}>
                                            {tarefa.titulo}
                                        </h3>
                                        {tarefa.descricao && (
                                            <p className="text-sm text-muted-foreground">
                                                {tarefa.descricao}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => tarefa.id && handleDeletar(tarefa.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}; 