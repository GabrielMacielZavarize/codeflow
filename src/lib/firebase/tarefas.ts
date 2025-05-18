import {
    addDocument,
    getDocument,
    updateDocument,
    deleteDocument,
    queryDocuments
} from './firestore';
import { Timestamp, addDoc, collection, onSnapshot, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from './config';
import { logActivity } from '@/services/auditService';

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
    userEmail: string; // Email do criador da tarefa
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

            // Registra a atividade de criação da tarefa
            await logActivity(
                tarefa.userId,
                tarefa.userEmail || '',
                'create',
                'task',
                docRef.id,
                `Tarefa "${tarefa.titulo}" foi criada`
            );

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

    // Buscar todas as tarefas
    async buscarTodasTarefas() {
        const q = query(
            collection(db, COLECAO_TAREFAS),
            orderBy('dataCriacao', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const tarefas = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            dataCriacao: doc.data().dataCriacao?.toDate(),
            dataAtualizacao: doc.data().dataAtualizacao?.toDate(),
            dataInicio: doc.data().dataInicio?.toDate(),
            dataFim: doc.data().dataFim?.toDate(),
            comentarios: doc.data().comentarios?.map((comentario: any) => ({
                ...comentario,
                dataCriacao: comentario.dataCriacao?.toDate(),
                respostas: comentario.respostas?.map((resposta: any) => ({
                    ...resposta,
                    dataCriacao: resposta.dataCriacao?.toDate()
                }))
            })) || []
        })) as Tarefa[];
        return tarefas;
    },

    // Atualizar uma tarefa
    async atualizarTarefa(tarefaId: string, dados: Partial<Tarefa>) {
        try {
            const tarefaAtual = await getDocument(COLECAO_TAREFAS, tarefaId) as Tarefa;
            if (!tarefaAtual) {
                throw new Error('Tarefa não encontrada');
            }

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

            await updateDocument(COLECAO_TAREFAS, tarefaId, dadosAtualizados);

            // Registra a atividade de atualização da tarefa
            const details = [];
            if (dados.titulo && dados.titulo !== tarefaAtual.titulo) {
                details.push(`título alterado para "${dados.titulo}"`);
            }
            if (dados.status && dados.status !== tarefaAtual.status) {
                details.push(`status alterado para "${dados.status}"`);
            }
            if (dados.prioridade && dados.prioridade !== tarefaAtual.prioridade) {
                details.push(`prioridade alterada para "${dados.prioridade}"`);
            }
            if (dados.responsavelId && dados.responsavelId !== tarefaAtual.responsavelId) {
                details.push(`responsável alterado para "${dados.responsavelNome}"`);
            }

            if (details.length > 0) {
                await logActivity(
                    tarefaAtual.userId,
                    tarefaAtual.userEmail || '',
                    'update',
                    'task',
                    tarefaId,
                    `Tarefa "${tarefaAtual.titulo}": ${details.join(', ')}`
                );
            }

            return await getDocument(COLECAO_TAREFAS, tarefaId) as Tarefa;
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
            throw error;
        }
    },

    // Deletar uma tarefa
    async deletarTarefa(tarefaId: string) {
        try {
            const tarefa = await getDocument(COLECAO_TAREFAS, tarefaId) as Tarefa;
            if (!tarefa) {
                throw new Error('Tarefa não encontrada');
            }

            await deleteDocument(COLECAO_TAREFAS, tarefaId);

            // Registra a atividade de exclusão da tarefa
            await logActivity(
                tarefa.userId,
                tarefa.userEmail || '',
                'delete',
                'task',
                tarefaId,
                `Tarefa "${tarefa.titulo}" foi excluída`
            );

            return true;
        } catch (error) {
            console.error('Erro ao deletar tarefa:', error);
            throw error;
        }
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
    async buscarTarefasPorStatus(concluida: boolean) {
        const tarefas = await queryDocuments(COLECAO_TAREFAS, 'concluida', '==', concluida) as Tarefa[];
        return tarefas;
    },

    // Obter tarefas em tempo real
    obterTarefasEmTempoReal(callback: (tarefas: Tarefa[]) => void) {
        const q = query(
            collection(db, COLECAO_TAREFAS),
            orderBy('dataCriacao', 'desc')
        );

        return onSnapshot(q, (snapshot) => {
            const tarefas = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                dataCriacao: doc.data().dataCriacao?.toDate(),
                dataAtualizacao: doc.data().dataAtualizacao?.toDate(),
                dataInicio: doc.data().dataInicio?.toDate(),
                dataFim: doc.data().dataFim?.toDate(),
                comentarios: doc.data().comentarios?.map((comentario: any) => ({
                    ...comentario,
                    dataCriacao: comentario.dataCriacao?.toDate(),
                    respostas: comentario.respostas?.map((resposta: any) => ({
                        ...resposta,
                        dataCriacao: resposta.dataCriacao?.toDate()
                    }))
                })) || []
            })) as Tarefa[];
            callback(tarefas);
        });
    }
}; 