import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Check, Github } from 'lucide-react';
import TypewriterText from '@/components/TypewriterText';

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
      <header className="sticky top-0 z-40 w-full border-b bg-white dark:bg-gray-900">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">CodeFlow</span>
            <span className="text-xl font-semibold text-gray-700 dark:text-gray-300 hidden sm:inline">Solutions</span>
          </Link>
          <nav className="flex-1 flex items-center justify-center">
            <div className="hidden md:flex items-center gap-12">
              <a href="#historia" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-all duration-300 text-lg font-medium hover:scale-110">
                Nossa História
              </a>
              <a href="#funcionalidades" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-all duration-300 text-lg font-medium hover:scale-110">
                Funcionalidades
              </a>
              <a href="#equipe" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-all duration-300 text-lg font-medium hover:scale-110">
                Equipe
              </a>
            </div>
          </nav>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="hover:bg-accent"
            >
              <a
                href="https://github.com/GabrielMacielZavarize/codeflow"
                target="_blank"
                rel="noopener noreferrer"
                title="Ver no GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </Button>
            {currentUser ? (
              <Button asChild className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 text-sm sm:text-base">
                <Link to="/dashboard">Acessar Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="outline" asChild className="hidden sm:flex border-2 transition-all duration-300 hover:scale-105 text-sm sm:text-base">
                  <Link to="/register">Criar Conta</Link>
                </Button>
                <Button asChild className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 text-sm sm:text-base">
                  <Link to="/login">Entrar</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container px-4 py-8 sm:py-12 md:py-24 lg:py-32 sm:px-8 bg-white dark:bg-gray-900">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="space-y-6 sm:space-y-8 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter text-gray-900 dark:text-white animate-slide-up">
              Sistema de Priorização de Tarefas
            </h1>
            <TypewriterText
              text="Otimize suas entregas, evite retrabalhos e melhore a gestão de recursos com nossa solução inteligente de priorização de tarefas."
              className="max-w-[600px] text-gray-600 dark:text-gray-400 text-base sm:text-lg md:text-xl leading-relaxed"
              speed={30}
            />
            <div className="flex flex-wrap gap-3 sm:gap-4 animate-slide-up delay-200">
              {currentUser ? (
                <Button size="lg" asChild className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 w-full sm:w-auto">
                  <Link to="/dashboard">
                    Acessar Dashboard <ArrowRight className="ml-2" size={18} />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" asChild className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 w-full sm:w-auto">
                    <Link to="/login">
                      Começar Agora <ArrowRight className="ml-2" size={18} />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild className="border-2 transition-all duration-300 hover:scale-105 w-full sm:w-auto">
                    <Link to="/register">Criar Conta</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="lg:block animate-fade-in delay-300 order-first lg:order-last">
            <img
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
              alt="Profissional gerenciando tarefas"
              className="mx-auto aspect-video rounded-xl object-cover shadow-2xl transform hover:scale-105 transition-all duration-500 w-full max-w-[550px]"
            />
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section id="historia" className="container px-4 py-8 sm:py-12 md:py-24 sm:px-8 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-[1000px] animate-fade-in">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-gray-900 dark:text-white">
              Nossa História
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 text-base sm:text-lg md:text-xl">
              Nascemos em 2025 com uma missão clara: transformar a gestão de projetos
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                O Desafio
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Identificamos que as empresas enfrentam atrasos frequentes na entrega de sistemas e aplicações,
                devido a falhas na gestão de projetos e alocação de recursos. A ausência de um sistema eficiente
                para priorizar tarefas e demandas contribui para prazos mal calculados e dificuldades na adaptação
                a mudanças de requisitos.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                Nossa Solução
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Criamos um sistema de priorização que ajuda a otimizar o planejamento, distribuindo recursos
                de forma mais estratégica. Isso impacta diretamente na qualidade das entregas, evitando retrabalhos,
                melhorando a reputação da empresa e diminuindo perdas contratuais.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="funcionalidades" className="container px-4 py-8 sm:py-12 md:py-24 sm:px-8 bg-white dark:bg-gray-900">
        <div className="mx-auto text-center mb-8 sm:mb-12 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-gray-900 dark:text-white">
            Funcionalidades Principais
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-base sm:text-lg md:text-xl max-w-[700px] mx-auto">
            Nossa solução oferece ferramentas completas para otimizar seu fluxo de trabalho
            e maximizar os resultados da sua equipe.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <Card key={i} className="transition-all hover:shadow-md">
              <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="rounded-full bg-primary/10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                  <Check className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section id="equipe" className="container px-4 py-8 sm:py-12 md:py-24 sm:px-8 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-[1200px] animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-center text-gray-900 dark:text-white mb-8 sm:mb-12">
            Conheça nossa equipe
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 sm:gap-8">
            {/* Gabriel Maciel */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden mb-4">
                <img
                  src="https://github.com/GabrielMacielZavarize.png"
                  alt="Gabriel Maciel"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Gabriel Maciel</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Desenvolvedor FrontEnd</p>
            </div>

            {/* Pedro Henrique */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden mb-4">
                <img
                  src="https://github.com/PedroHarter.png"
                  alt="Pedro Henrique"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Pedro Henrique</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Desenvolvedor Backend</p>
            </div>

            {/* Wilian Vieira */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden mb-4">
                <img
                  src="https://github.com/WilianVieiraF.png"
                  alt="Wilian Vieira"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Wilian Vieira</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Designer</p>
            </div>

            {/* Alexandre */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden mb-4">
                <img
                  src="https://github.com/xandetds.png"
                  alt="Alexandre"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Alexandre</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Product Manager</p>
            </div>

            {/* Pedro Canto */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden mb-4">
                <img
                  src="https://github.com/PedroCanto.png"
                  alt="Pedro Canto"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Pedro Canto</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">QA Engineer</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-8 sm:py-12 md:py-24 sm:px-8 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-[800px] text-center animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-gray-900 dark:text-white">
            Pronto para aumentar a produtividade da sua equipe?
          </h2>
          <p className="mt-4 mb-6 sm:mb-8 text-gray-600 dark:text-gray-400 text-base sm:text-lg md:text-xl">
            Junte-se a milhares de empresas que transformaram sua gestão de tarefas com o CodeFlow Solutions.
          </p>
          {currentUser ? (
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 w-full sm:w-auto">
              <Link to="/dashboard">Acessar Seu Dashboard</Link>
            </Button>
          ) : (
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 w-full sm:w-auto">
              <Link to="/register">Criar Conta Gratuita</Link>
            </Button>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container px-4 py-8 sm:py-12 md:py-24 sm:px-8 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-[1200px] animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-center text-gray-900 dark:text-white mb-8 sm:mb-12">
            O que nossos clientes dizem
          </h2>
          <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* Testimonial 1 */}
            <Card className="p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
                    alt="Maria Silva"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Maria Silva</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Gerente de Projetos</p>
                </div>
              </div>
              <div className="flex gap-1 mb-3 sm:mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                "O CodeFlow Solutions revolucionou a forma como nossa equipe gerencia projetos. A priorização inteligente nos ajudou a entregar mais valor em menos tempo."
              </p>
            </Card>

            {/* Testimonial 2 */}
            <Card className="p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
                    alt="João Santos"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">João Santos</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">CTO</p>
                </div>
              </div>
              <div className="flex gap-1 mb-3 sm:mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                "A automação de processos e os relatórios customizados nos deram insights valiosos para melhorar nossa produtividade. Recomendo fortemente!"
              </p>
            </Card>

            {/* Testimonial 3 */}
            <Card className="p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                    alt="Ana Oliveira"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Ana Oliveira</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Product Owner</p>
                </div>
              </div>
              <div className="flex gap-1 mb-3 sm:mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                "A interface intuitiva e as funcionalidades de gestão de equipes nos ajudaram a melhorar significativamente nossa comunicação e produtividade."
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="container px-4 py-6 sm:py-8 md:py-12 sm:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <span className="text-base sm:text-lg font-semibold">CodeFlow Solutions</span>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} Todos os direitos reservados
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
              <Link to="/terms" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                Termos de Uso
              </Link>
              <Link to="/privacy" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                Privacidade
              </Link>
              <Link to="/careers" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                Trabalhe Conosco
              </Link>
              <a href="mailto:gabrielmzavarize@gmail.com" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                Contato
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
