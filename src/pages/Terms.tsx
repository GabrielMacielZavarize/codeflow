import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Terms = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <div className="container px-4 py-8 sm:px-8">
                <Button variant="ghost" asChild className="mb-8">
                    <Link to="/" className="flex items-center gap-2">
                        <ArrowLeft size={20} />
                        Voltar para Home
                    </Link>
                </Button>

                <div className="max-w-4xl mx-auto space-y-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Termos de Uso</h1>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">1. Aceitação dos Termos</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Ao acessar e usar o CodeFlow Solutions, você concorda em cumprir estes termos de uso. Se você não concordar com qualquer parte destes termos, não poderá acessar o serviço.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">2. Uso do Serviço</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            O CodeFlow Solutions é uma plataforma de gestão de tarefas e projetos. Você concorda em usar o serviço apenas para fins legais e de acordo com estes termos.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">3. Contas de Usuário</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Ao criar uma conta, você é responsável por manter a confidencialidade de suas credenciais e por todas as atividades que ocorrem em sua conta.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">4. Propriedade Intelectual</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Todo o conteúdo, funcionalidades e design do CodeFlow Solutions são protegidos por direitos autorais e outras leis de propriedade intelectual.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">5. Limitação de Responsabilidade</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            O CodeFlow Solutions não será responsável por quaisquer danos indiretos, incidentais, especiais ou consequentes resultantes do uso ou da incapacidade de usar o serviço.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">6. Modificações dos Termos</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação dos termos atualizados.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">7. Contato</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Para questões relacionadas a estes termos, entre em contato através do email: gabrielmzavarize@gmail.com
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Terms; 