import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

const BetaForm = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'duplicate'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            // Verifica se o e-mail já está cadastrado
            const q = query(collection(db, 'betaSignups'), where('email', '==', email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setStatus('duplicate');
                return;
            }

            // Adiciona o e-mail à coleção betaSignups
            await addDoc(collection(db, 'betaSignups'), {
                email,
                createdAt: serverTimestamp(),
                status: 'pending'
            });

            setStatus('success');
            setEmail('');
        } catch (error) {
            console.error('Erro ao salvar e-mail:', error);
            setStatus('error');
        }
    };

    return (
        <section id="beta-section" className="py-16 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                        Participe da Versão Beta
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                        Seja um dos primeiros a experimentar nossa plataforma. Inscreva-se para receber acesso antecipado.
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Seu melhor e-mail"
                            className="flex-1 max-w-md px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 
                       focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                       dark:bg-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                            required
                        />
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium
                       hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                       disabled:opacity-50 disabled:cursor-not-allowed
                       dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors duration-200"
                        >
                            {status === 'loading' ? 'Enviando...' : 'Participar da Beta'}
                        </button>
                    </form>

                    {status === 'success' && (
                        <p className="mt-4 text-green-600 dark:text-green-400">
                            Obrigado! Em breve entraremos em contato com você.
                        </p>
                    )}
                    {status === 'error' && (
                        <p className="mt-4 text-red-600 dark:text-red-400">
                            Ops! Algo deu errado. Por favor, tente novamente.
                        </p>
                    )}
                    {status === 'duplicate' && (
                        <p className="mt-4 text-yellow-600 dark:text-yellow-400">
                            Este e-mail já está cadastrado. Em breve entraremos em contato com você.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default BetaForm; 