
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Check } from 'lucide-react';

const Home = () => {
  const { currentUser } = useAuth();

  const features = [
    {
      title: "Priorização Inteligente",
      description: "Organize tarefas por impacto e esforço para maximizar produtividade."
    },
    {
      title: "Análise de Desempenho",
      description: "Visualize métricas de entrega e evolução de projetos em tempo real."
    },
    {
      title: "Gestão de Equipes",
      description: "Distribua recursos e acompanhe o desempenho de cada colaborador."
    },
    {
      title: "Automação de Processos",
      description: "Reduza tarefas manuais com fluxos de trabalho inteligentes."
    },
    {
      title: "Relatórios Customizados",
      description: "Gere insights valiosos sobre projetos e entregas."
    },
    {
      title: "Integração Completa",
      description: "Conecte-se facilmente com suas ferramentas de trabalho favoritas."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header/Nav */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">CodeFlow</span>
            <span className="text-xl font-semibold text-gray-700 dark:text-gray-300">Solutions</span>
          </Link>
          <nav className="flex items-center gap-4">
            {currentUser ? (
              <Button asChild>
                <Link to="/dashboard">Acessar Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="outline" asChild className="hidden sm:flex">
                  <Link to="/register">Criar Conta</Link>
                </Button>
                <Button asChild>
                  <Link to="/login">Entrar</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container px-4 py-12 md:py-24 lg:py-32 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-gray-900 dark:text-white">
              Sistema de Priorização de Tarefas
            </h1>
            <p className="max-w-[600px] text-gray-600 dark:text-gray-400 md:text-xl">
              Otimize suas entregas, evite retrabalhos e melhore a gestão de recursos com nossa 
              solução inteligente de priorização de tarefas.
            </p>
            <div className="flex flex-wrap gap-4">
              {currentUser ? (
                <Button size="lg" asChild>
                  <Link to="/dashboard">
                    Acessar Dashboard <ArrowRight className="ml-2" size={18} />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" asChild>
                    <Link to="/login">
                      Começar Agora <ArrowRight className="ml-2" size={18} />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/register">Criar Conta</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="lg:block">
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
              alt="Profissional gerenciando tarefas" 
              className="mx-auto aspect-video rounded-xl object-cover shadow-xl" 
              width={550}
              height={310}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-12 md:py-24 sm:px-8 bg-gray-50 dark:bg-gray-800/30">
        <div className="mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900 dark:text-white">
            Funcionalidades Principais
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 md:text-xl max-w-[700px] mx-auto">
            Nossa solução oferece ferramentas completas para otimizar seu fluxo de trabalho
            e maximizar os resultados da sua equipe.
          </p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <Card key={i} className="transition-all hover:shadow-md">
              <CardContent className="p-6 space-y-4">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="container px-4 py-12 md:py-24 sm:px-8">
        <div className="mx-auto max-w-[800px] text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900 dark:text-white">
            Pronto para aumentar a produtividade da sua equipe?
          </h2>
          <p className="mt-4 mb-8 text-gray-600 dark:text-gray-400 md:text-xl">
            Junte-se a milhares de empresas que transformaram sua gestão de tarefas com o CodeFlow Solutions.
          </p>
          {currentUser ? (
            <Button size="lg" asChild>
              <Link to="/dashboard">Acessar Seu Dashboard</Link>
            </Button>
          ) : (
            <Button size="lg" asChild>
              <Link to="/register">Criar Conta Gratuita</Link>
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800">
        <div className="container px-4 py-8 md:py-12 sm:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">CodeFlow Solutions</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} Todos os direitos reservados
              </span>
            </div>
            <nav className="flex gap-4 sm:gap-6">
              <a href="#" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
                Termos de Uso
              </a>
              <a href="#" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
                Privacidade
              </a>
              <a href="#" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
                Contato
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
