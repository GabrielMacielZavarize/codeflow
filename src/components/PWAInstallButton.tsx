import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Check } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { TermsModal } from './TermsModal';

export function PWAInstallButton() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [showTerms, setShowTerms] = useState(false);

    useEffect(() => {
        const checkIfInstalled = () => {
            if (
                window.matchMedia('(display-mode: standalone)').matches ||
                (window.navigator as any).standalone ||
                document.referrer.includes('android-app://')
            ) {
                setIsInstalled(true);
            }
        };

        checkIfInstalled();
        window.addEventListener('load', checkIfInstalled);

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        const handleAppInstalled = () => {
            setIsInstalled(true);
            toast.success('App instalado com sucesso!');
        };

        const handleDisplayModeChange = () => {
            checkIfInstalled();
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);
        window.matchMedia('(display-mode: standalone)').addEventListener('change', handleDisplayModeChange);

        return () => {
            window.removeEventListener('load', checkIfInstalled);
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
            window.matchMedia('(display-mode: standalone)').removeEventListener('change', handleDisplayModeChange);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) {
            toast.error('Não foi possível instalar o app. Tente usar o menu do navegador.');
            return;
        }

        try {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                toast.success('Instalando o app...');
            } else {
                toast.error('Instalação cancelada');
            }
        } catch (error) {
            toast.error('Erro ao instalar o app');
        }

        setDeferredPrompt(null);
    };

    if (isInstalled) {
        return (
            <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 hover:bg-accent hover:scale-110 transition-all duration-300"
                disabled
            >
                <Check className="h-4 w-4" />
            </Button>
        );
    }

    return (
        <>
            <Button
                onClick={() => setShowTerms(true)}
                size="sm"
                variant="ghost"
                className="flex items-center gap-2 hover:bg-accent hover:scale-110 transition-all duration-300"
            >
                <Download className="h-4 w-4" />
            </Button>

            <TermsModal
                isOpen={showTerms}
                onClose={() => setShowTerms(false)}
                onAccept={handleInstall}
            />
        </>
    );
} 