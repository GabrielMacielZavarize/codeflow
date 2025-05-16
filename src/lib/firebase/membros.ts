import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, Timestamp } from 'firebase/firestore';
import { db } from './config';

export interface MembroEquipe {
    id: string;
    nome: string;
    cargo: string;
    email: string;
    bio?: string;
    avatar?: string;
    isNew: boolean;
    dataEntrada: Date;
    habilidades: string[];
    status: 'Junior' | 'Pleno' | 'Senior' | 'Analista';
    tarefas?: number;
}

class MembrosService {
    private readonly collectionName = 'membros';

    async buscarMembros(): Promise<MembroEquipe[]> {
        const querySnapshot = await getDocs(collection(db, this.collectionName));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            dataEntrada: doc.data().dataEntrada?.toDate() || new Date()
        })) as MembroEquipe[];
    }

    async adicionarMembro(membro: Omit<MembroEquipe, 'id'>): Promise<MembroEquipe> {
        const docRef = await addDoc(collection(db, this.collectionName), {
            ...membro,
            dataEntrada: Timestamp.fromDate(membro.dataEntrada)
        });
        return {
            id: docRef.id,
            ...membro
        };
    }

    async atualizarMembro(id: string, dados: Partial<MembroEquipe>): Promise<void> {
        const docRef = doc(db, this.collectionName, id);
        const dadosAtualizados = {
            ...dados,
            dataEntrada: dados.dataEntrada ? Timestamp.fromDate(dados.dataEntrada) : undefined
        };

        // Remove campos undefined para evitar erros do Firestore
        Object.keys(dadosAtualizados).forEach(key =>
            dadosAtualizados[key] === undefined && delete dadosAtualizados[key]
        );

        await updateDoc(docRef, dadosAtualizados);
    }

    async removerMembro(id: string): Promise<void> {
        const docRef = doc(db, this.collectionName, id);
        await deleteDoc(docRef);
    }

    async inicializarMembrosPadrao(): Promise<void> {
        const membros = await this.buscarMembros();
        if (membros.length === 0) {
            const membrosPadrao = [
                {
                    nome: 'Gabriel M.',
                    cargo: 'Desenvolvedor Frontend',
                    email: 'gabrielmzavarize@gmail.com',
                    bio: 'Desenvolvedor Frontend apaixonado por criar interfaces modernas e intuitivas. Especialista em React, TypeScript e UI/UX.',
                    avatar: 'https://unavatar.io/github/GabrielMacielZavarize',
                    isNew: true,
                    dataEntrada: new Date('2024-03-15'),
                    habilidades: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'UI/UX'],
                    status: 'Pleno',
                    tarefas: 0
                },
                {
                    nome: 'Pedro H.',
                    cargo: 'Desenvolvedor Backend',
                    email: 'pedro.henrique@codeflow.com',
                    bio: 'Desenvolvedor Backend com foco em arquitetura de sistemas escaláveis. Experiência em Node.js, Python e arquitetura de microsserviços.',
                    avatar: 'https://unavatar.io/github/PedroHarter',
                    isNew: false,
                    dataEntrada: new Date('2024-02-01'),
                    habilidades: ['Node.js', 'Python', 'Docker', 'AWS', 'MongoDB'],
                    status: 'Pleno',
                    tarefas: 0
                },
                {
                    nome: 'Wilian V.',
                    cargo: 'Designer',
                    email: 'wilian.viana@codeflow.com',
                    bio: 'Designer criativo com foco em experiência do usuário e interfaces modernas. Especialista em Figma e design systems.',
                    avatar: 'https://unavatar.io/github/WilianVieiraF',
                    isNew: true,
                    dataEntrada: new Date('2024-03-10'),
                    habilidades: ['Figma', 'UI Design', 'UX Research', 'Design Systems', 'Prototipagem'],
                    status: 'Pleno',
                    tarefas: 0
                },
                {
                    nome: 'Alexandre',
                    cargo: 'Product Manager',
                    email: 'maria.silva@codeflow.com',
                    bio: 'Product Manager com experiência em gestão de produtos digitais e metodologias ágeis. Foco em entregar valor ao usuário final.',
                    avatar: 'https://unavatar.io/github/xandetds',
                    isNew: false,
                    dataEntrada: new Date('2024-01-15'),
                    habilidades: ['Product Strategy', 'Agile', 'User Research', 'Data Analysis', 'Stakeholder Management'],
                    status: 'Pleno',
                    tarefas: 0
                },
                {
                    nome: 'Pedro C.',
                    cargo: 'QA Engineer',
                    email: 'joao.pedro@codeflow.com',
                    bio: 'QA Engineer especializado em testes automatizados e garantia de qualidade. Experiência em Cypress, Jest e metodologias de teste.',
                    avatar: 'https://unavatar.io/github/PedroCanto',
                    isNew: false,
                    dataEntrada: new Date('2024-02-20'),
                    habilidades: ['Testes Automatizados', 'Cypress', 'Jest', 'CI/CD', 'Qualidade de Software'],
                    status: 'Pleno',
                    tarefas: 0
                }
            ];

            for (const membro of membrosPadrao) {
                await this.adicionarMembro(membro);
            }
        }
    }
}

export const membrosService = new MembrosService(); 