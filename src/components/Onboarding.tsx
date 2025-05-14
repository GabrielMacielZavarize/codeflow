
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';

interface OnboardingStep {
  title: string;
  description: string;
  target?: string;
}

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(true);

  const steps: OnboardingStep[] = [
    {
      title: "Bem-vindo ao CodeFlow Solutions",
      description: "Este guia rápido vai te ajudar a conhecer nosso sistema de priorização de tarefas. Vamos começar!"
    },
    {
      title: "Dashboard",
      description: "Aqui você pode visualizar todas as suas tarefas organizadas por prioridade e status.",
      target: ".dashboard-container"
    },
    {
      title: "Adicionar Tarefas",
      description: "Use o botão '+' para adicionar novas tarefas ao sistema.",
      target: ".add-task-button"
    },
    {
      title: "Filtros",
      description: "Utilize os filtros para encontrar rapidamente as tarefas que precisa.",
      target: ".task-filters"
    },
    {
      title: "Visualizações",
      description: "Alterne entre diferentes visualizações: lista, calendário ou kanban.",
      target: ".view-options"
    },
    {
      title: "Configurações",
      description: "Personalize o sistema de acordo com suas preferências em Configurações.",
      target: ".settings-link"
    }
  ];

  useEffect(() => {
    // Verifica se o usuário já completou o onboarding
    const hasCompletedOnboarding = localStorage.getItem('onboarding-completed');
    if (hasCompletedOnboarding === 'true') {
      setShowOnboarding(false);
    }
  }, []);

  useEffect(() => {
    // Destaca o elemento alvo atual
    const highlightTarget = () => {
      const target = steps[currentStep]?.target;
      if (target) {
        const element = document.querySelector(target);
        if (element) {
          element.classList.add('onboarding-highlight');
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          return () => {
            element.classList.remove('onboarding-highlight');
          };
        }
      }
    };
    
    const cleanup = highlightTarget();
    return cleanup;
  }, [currentStep, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('onboarding-completed', 'true');
    onComplete();
  };

  if (!showOnboarding) {
    return null;
  }

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-[90%] max-w-md shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">
            {currentStepData.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-600 dark:text-gray-400">
          {currentStepData.description}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSkip}
            className="text-gray-500 dark:text-gray-400"
          >
            <X className="h-4 w-4 mr-1" /> Pular tutorial
          </Button>
          <Button onClick={handleNext}>
            {currentStep < steps.length - 1 ? (
              'Próximo'
            ) : (
              <>
                <Check className="h-4 w-4 mr-1" /> Concluir
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Onboarding;
