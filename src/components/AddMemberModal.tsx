import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MembroEquipe } from '@/lib/firebase/membros';
import { toast } from '@/components/ui/sonner';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface AddMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    onMemberAdded: (membro: Omit<MembroEquipe, 'id'>) => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
    isOpen,
    onClose,
    onMemberAdded
}) => {
    const [nome, setNome] = useState('');
    const [cargo, setCargo] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');
    const [avatar, setAvatar] = useState('');
    const [habilidades, setHabilidades] = useState<string[]>([]);
    const [novaHabilidade, setNovaHabilidade] = useState('');
    const [status, setStatus] = useState<'Junior' | 'Pleno' | 'Senior' | 'Analista'>('Junior');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nome || !cargo || !email) {
            toast.error('Por favor, preencha todos os campos obrigatórios');
            return;
        }

        try {
            setLoading(true);
            const novoMembro: Omit<MembroEquipe, 'id'> = {
                nome,
                cargo,
                email,
                bio,
                avatar: avatar || `https://avatar.vercel.sh/${nome}`,
                tarefas: 0,
                isNew: true,
                dataEntrada: new Date(),
                habilidades,
                status
            };

            await onMemberAdded(novoMembro);
            toast.success('Membro adicionado com sucesso!');
            onClose();
            resetForm();
        } catch (error) {
            toast.error('Erro ao adicionar membro');
            console.error('Erro ao adicionar membro:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setNome('');
        setCargo('');
        setEmail('');
        setBio('');
        setAvatar('');
        setHabilidades([]);
        setNovaHabilidade('');
        setStatus('Junior');
    };

    const handleAddHabilidade = () => {
        if (novaHabilidade && !habilidades.includes(novaHabilidade)) {
            setHabilidades([...habilidades, novaHabilidade]);
            setNovaHabilidade('');
        }
    };

    const handleRemoveHabilidade = (habilidade: string) => {
        setHabilidades(habilidades.filter(h => h !== habilidade));
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Adicionar Novo Membro</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nome">Nome *</Label>
                        <Input
                            id="nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder="Nome do membro"
                            required
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="cargo">Cargo *</Label>
                        <Input
                            id="cargo"
                            value={cargo}
                            onChange={(e) => setCargo(e.target.value)}
                            placeholder="Cargo do membro"
                            required
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Nível *</Label>
                        <Select value={status} onValueChange={(value: 'Junior' | 'Pleno' | 'Senior' | 'Analista') => setStatus(value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione o nível" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Junior">Junior</SelectItem>
                                <SelectItem value="Pleno">Pleno</SelectItem>
                                <SelectItem value="Senior">Senior</SelectItem>
                                <SelectItem value="Analista">Analista</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email do membro"
                            required
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Biografia</Label>
                        <Textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Biografia do membro"
                            className="w-full min-h-[100px]"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="avatar">URL do Avatar (GitHub)</Label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Input
                                id="avatar"
                                value={avatar}
                                onChange={(e) => setAvatar(e.target.value)}
                                placeholder="Nome de usuário do GitHub (ex: GabrielMacielZavarize)"
                                className="w-full"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    if (avatar) {
                                        setAvatar(`https://unavatar.io/github/${avatar}`);
                                    }
                                }}
                                className="whitespace-nowrap"
                            >
                                Gerar URL
                            </Button>
                        </div>
                        {avatar && (
                            <div className="mt-2">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={avatar.startsWith('https://') ? avatar : `https://github.com/${avatar}.png`} />
                                    <AvatarFallback>{nome?.[0] || '?'}</AvatarFallback>
                                </Avatar>
                            </div>
                        )}
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Digite o nome de usuário do GitHub ou cole a URL completa da imagem
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label>Habilidades</Label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Input
                                value={novaHabilidade}
                                onChange={(e) => setNovaHabilidade(e.target.value)}
                                placeholder="Nova habilidade"
                                className="w-full"
                            />
                            <Button type="button" onClick={handleAddHabilidade} className="whitespace-nowrap">
                                Adicionar
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {habilidades.map((habilidade, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
                                >
                                    <span>{habilidade}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveHabilidade(habilidade)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                            {loading ? 'Adicionando...' : 'Adicionar Membro'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}; 