import {
    addDocument,
    getDocument,
    updateDocument,
    deleteDocument,
    queryDocuments
} from './firestore';
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import { db } from './config';

export interface Comentario {
    id: string;
    texto: string;
    userId: string;
    userName: string;
    dataCriacao: Date;
    respostas?: Comentario[];
}

export interface Tarefa {
    id?: string;
    titulo: string;
    descricao?: string;
    concluida: boolean;
    dataCriacao: Date;
    dataAtualizacao: Date;
    dataInicio: Date;
    dataFim: Date;
    userId: string; // Criador da tarefa
    responsavelId: string; // Responsável pela tarefa
    responsavelNome: string;
    responsavelAvatar?: string;
    prioridade?: 'alta' | 'media' | 'baixa';
    status: 'pendente' | 'em_progresso' | 'concluida' | 'duvida';
    comentarios?: Comentario[];
}

const COLECAO_TAREFAS = 'tarefas';

const converterParaFirestore = (data: Date): Timestamp => {
    return Timestamp.fromDate(data);
};

const converterParaDate = (timestamp: any): Date => {
    if (!timestamp) return new Date();
    return timestamp instanceof Date ? timestamp : timestamp.toDate();
};

export const tarefasService = {
    // Criar uma nova tarefa
    async criarTarefa(tarefa: Omit<Tarefa, 'id' | 'dataCriacao' | 'dataAtualizacao'>) {
        try {
            const novaTarefa = {
                ...tarefa,
                dataCriacao: Timestamp.fromDate(new Date()),
                dataAtualizacao: Timestamp.fromDate(new Date()),
                dataInicio: Timestamp.fromDate(tarefa.dataInicio instanceof Date ? tarefa.dataInicio : new Date(tarefa.dataInicio)),
                dataFim: tarefa.dataFim ? Timestamp.fromDate(tarefa.dataFim instanceof Date ? tarefa.dataFim : new Date(tarefa.dataFim)) : null,
                comentarios: tarefa.comentarios?.map(comentario => ({
                    ...comentario,
                    dataCriacao: Timestamp.fromDate(comentario.dataCriacao),
                    respostas: comentario.respostas?.map(resposta => ({
                        ...resposta,
                        dataCriacao: Timestamp.fromDate(resposta.dataCriacao)
                    }))
                })) || [],
                responsavelId: tarefa.responsavelId || '',
                responsavelNome: tarefa.responsavelNome || '',
                status: tarefa.status || 'pendente'
            };

            const docRef = await addDoc(collection(db, COLECAO_TAREFAS), novaTarefa);

            return {
                ...tarefa,
                id: docRef.id,
                dataCriacao: novaTarefa.dataCriacao.toDate(),
                dataAtualizacao: novaTarefa.dataAtualizacao.toDate(),
                dataInicio: novaTarefa.dataInicio.toDate(),
                dataFim: novaTarefa.dataFim ? novaTarefa.dataFim.toDate() : null
            };
        } catch (error) {
            console.error('Erro ao criar tarefa:', error);
            throw error;
        }
    },

    // Buscar todas as tarefas de um usuário
    async buscarTarefasUsuario(userId: string) {
        const tarefas = await queryDocuments(COLECAO_TAREFAS, 'userId', '==', userId) as any[];
        return tarefas.map(tarefa => ({
            ...tarefa,
            dataCriacao: converterParaDate(tarefa.dataCriacao),
            dataAtualizacao: converterParaDate(tarefa.dataAtualizacao),
            dataInicio: converterParaDate(tarefa.dataInicio),
            dataFim: converterParaDate(tarefa.dataFim),
            comentarios: tarefa.comentarios?.map((comentario: any) => ({
                ...comentario,
                dataCriacao: converterParaDate(comentario.dataCriacao),
                respostas: comentario.respostas?.map((resposta: any) => ({
                    ...resposta,
                    dataCriacao: converterParaDate(resposta.dataCriacao)
                }))
            }))
        })) as Tarefa[];
    },

    // Atualizar uma tarefa
    async atualizarTarefa(tarefaId: string, dados: Partial<Tarefa>) {
        const dadosAtualizados = {
            ...dados,
            dataAtualizacao: converterParaFirestore(new Date()),
            ...(dados.dataInicio && {
                dataInicio: converterParaFirestore(dados.dataInicio instanceof Date ? dados.dataInicio : new Date(dados.dataInicio))
            }),
            ...(dados.dataFim && {
                dataFim: converterParaFirestore(dados.dataFim instanceof Date ? dados.dataFim : new Date(dados.dataFim))
            })
        };
        return await updateDocument(COLECAO_TAREFAS, tarefaId, dadosAtualizados);
    },

    // Deletar uma tarefa
    async deletarTarefa(tarefaId: string) {
        return await deleteDocument(COLECAO_TAREFAS, tarefaId);
    },

    // Adicionar comentário
    async adicionarComentario(tarefaId: string, comentario: Omit<Comentario, 'id' | 'dataCriacao'>) {
        const tarefa = await getDocument(COLECAO_TAREFAS, tarefaId) as Tarefa;
        const novoComentario = {
            ...comentario,
            id: Math.random().toString(36).substr(2, 9),
            dataCriacao: new Date(),
            respostas: []
        };

        const comentarios = [...(tarefa.comentarios || []), novoComentario];
        await this.atualizarTarefa(tarefaId, { comentarios });
        return await getDocument(COLECAO_TAREFAS, tarefaId) as Tarefa;
    },

    // Responder a um comentário
    async responderComentario(tarefaId: string, comentarioId: string, resposta: Omit<Comentario, 'id' | 'dataCriacao'>) {
        const tarefa = await getDocument(COLECAO_TAREFAS, tarefaId) as Tarefa;
        const comentarios = tarefa.comentarios || [];

        const novoComentario = {
            ...resposta,
            id: Math.random().toString(36).substr(2, 9),
            dataCriacao: new Date()
        };

        const comentariosAtualizados = comentarios.map(comentario => {
            if (comentario.id === comentarioId) {
                return {
                    ...comentario,
                    respostas: [...(comentario.respostas || []), novoComentario]
                };
            }
            return comentario;
        });

        await this.atualizarTarefa(tarefaId, { comentarios: comentariosAtualizados });
        return await getDocument(COLECAO_TAREFAS, tarefaId) as Tarefa;
    },

    // Buscar tarefas por status
    async buscarTarefasPorStatus(userId: string, concluida: boolean) {
        const tarefas = await queryDocuments(COLECAO_TAREFAS, 'userId', '==', userId) as Tarefa[];
        return tarefas.filter(tarefa => tarefa.concluida === concluida);
    }
}; 