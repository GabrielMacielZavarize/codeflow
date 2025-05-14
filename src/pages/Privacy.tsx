import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Privacy = () => {
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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Política de Privacidade</h1>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">1. Coleta de Informações</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Coletamos informações que você nos fornece diretamente, como nome, email e informações de perfil. Também coletamos dados de uso e informações técnicas quando você utiliza nosso serviço.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">2. Uso das Informações</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Utilizamos suas informações para fornecer, manter e melhorar nossos serviços, desenvolver novos recursos e proteger o CodeFlow Solutions e nossos usuários.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">3. Compartilhamento de Dados</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Não compartilhamos suas informações pessoais com terceiros, exceto quando necessário para fornecer nossos serviços ou quando exigido por lei.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">4. Segurança dos Dados</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">5. Seus Direitos</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Você também pode solicitar uma cópia dos seus dados ou retirar seu consentimento para o processamento de dados.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">6. Cookies e Tecnologias Similares</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso do serviço e personalizar o conteúdo.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">7. Alterações na Política</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Podemos atualizar esta política periodicamente. Notificaremos você sobre quaisquer alterações significativas através do email ou por meio de um aviso em nosso site.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">8. Contato</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Para questões sobre privacidade, entre em contato através do email: gabrielmzavarize@gmail.com
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Privacy; 