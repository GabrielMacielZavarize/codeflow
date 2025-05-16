import React from 'react';
import { AdicionarTarefa } from '@/components/tarefas/AdicionarTarefa';
import { ListaTarefas } from '@/components/tarefas/ListaTarefas';

export const Tarefas = () => {
    return (
        <div className="container mx-auto py-8 space-y-8">
            <h1 className="text-3xl font-bold">Tarefas</h1>
            <div className="grid gap-8">
                <AdicionarTarefa />
                <ListaTarefas />
            </div>
        </div>
    );
}; 