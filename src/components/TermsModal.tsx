import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download } from "lucide-react";

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: () => void;
}

export function TermsModal({ isOpen, onClose, onAccept }: TermsModalProps) {
    const [accepted, setAccepted] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] max-w-[600px] p-4 sm:p-6">
                <DialogHeader className="space-y-2">
                    <DialogTitle className="text-xl sm:text-2xl font-bold text-center">
                        Instalar CodeFlow
                    </DialogTitle>
                    <DialogDescription className="text-sm sm:text-base text-center">
                        Antes de instalar, por favor leia e aceite nossos termos de uso
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[50vh] sm:h-[400px] rounded-md border p-3 sm:p-4">
                    <div className="space-y-4 sm:space-y-6">
                        <section>
                            <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">1. Uso do Aplicativo</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                O CodeFlow é uma plataforma de gerenciamento de projetos que permite organizar e acompanhar suas tarefas de forma eficiente. Ao instalar o aplicativo, você concorda em utilizá-lo de acordo com estes termos.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">2. Privacidade e Dados</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                Seus dados são importantes para nós. Garantimos que todas as informações fornecidas serão tratadas com confidencialidade e segurança, seguindo as melhores práticas de proteção de dados.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">3. Responsabilidades</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                Você é responsável por manter suas credenciais de acesso seguras e por todas as atividades realizadas em sua conta. Recomendamos o uso de senhas fortes e a ativação da autenticação em duas etapas.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">4. Atualizações</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                O CodeFlow pode receber atualizações periódicas para melhorar a experiência do usuário e adicionar novas funcionalidades. Estas atualizações serão instaladas automaticamente.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">5. Suporte</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                Em caso de dúvidas ou problemas, nossa equipe de suporte está disponível para ajudar. Você pode entrar em contato através do email support@codeflow.com.br.
                            </p>
                        </section>
                    </div>
                </ScrollArea>

                <div className="flex items-center space-x-2 mt-3 sm:mt-4">
                    <Checkbox
                        id="terms"
                        checked={accepted}
                        onCheckedChange={(checked) => setAccepted(checked as boolean)}
                        className="h-4 w-4 sm:h-5 sm:w-5"
                    />
                    <Label
                        htmlFor="terms"
                        className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Li e concordo com os termos de uso
                    </Label>
                </div>

                <DialogFooter className="mt-4 sm:mt-6 flex-col sm:flex-row gap-2 sm:gap-0">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="w-full sm:w-auto sm:mr-2 text-sm sm:text-base"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={onAccept}
                        disabled={!accepted}
                        className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-sm sm:text-base"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Instalar Agora
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 