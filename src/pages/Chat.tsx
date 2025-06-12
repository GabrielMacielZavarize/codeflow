import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { sendMessage, subscribeToMessages, ChatMessage, deleteMessage } from '@/lib/firebase/chat';
import { setupPresence, subscribeToOnlineUsers } from '@/lib/firebase/presence';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Send, Loader2, MessageSquare, Users, ChevronLeft, MoreVertical, Trash2, Circle, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OnlineUser {
    id: string;
    name: string;
    email: string;
    lastSeen: number;
    state: 'online' | 'offline';
}

interface Conversation {
    id: string;
    participants: string[];
    lastMessage?: string;
}

const Chat = () => {
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [activeTab, setActiveTab] = useState<'online' | 'offline'>('online');
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [showConversations, setShowConversations] = useState(window.innerWidth >= 768);
    const [selectedChat, setSelectedChat] = useState('forum');

    useEffect(() => {
        const handleResize = () => {
            setShowConversations(window.innerWidth >= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // Configurar presença do usuário
        const cleanupPresence = setupPresence();

        // Inscrever para receber mensagens
        const unsubscribeMessages = subscribeToMessages(
            (updatedMessages) => {
                setMessages(updatedMessages);
                if (scrollRef.current) {
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                }
            },
            (error) => {
                console.error('Erro ao receber mensagens:', error);
                toast.error('Erro ao carregar mensagens');
            },
            selectedChat
        );

        // Inscrever para receber status dos usuários
        const unsubscribeOnlineUsers = subscribeToOnlineUsers(
            (users) => {
                setOnlineUsers(users);
            },
            (error) => {
                console.error('Erro ao receber status dos usuários:', error);
                toast.error('Erro ao carregar usuários');
            }
        );

        return () => {
            cleanupPresence?.();
            unsubscribeMessages();
            unsubscribeOnlineUsers();
        };
    }, [selectedChat]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser) return;

        try {
            setIsLoading(true);
            const messageData = {
                content: newMessage.trim(),
                userId: currentUser.uid,
                userName: currentUser.displayName || 'Usuário',
                userEmail: currentUser.email || '',
                chatId: selectedChat,
                isPrivate: selectedChat !== 'forum',
                participants: selectedChat === 'forum'
                    ? []
                    : [currentUser.uid, selectedChat]
            };

            await sendMessage(messageData);

            // Atualiza a última mensagem na conversa
            if (selectedChat !== 'forum') {
                setConversations(prev => prev.map(conv =>
                    conv.id === selectedChat
                        ? { ...conv, lastMessage: newMessage.trim() }
                        : conv
                ));
            }

            setNewMessage('');
            inputRef.current?.focus();
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            toast.error('Erro ao enviar mensagem');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteMessage = async (messageId: string) => {
        try {
            await deleteMessage(messageId);

            // Atualiza a última mensagem da conversa
            if (selectedChat !== 'forum') {
                const remainingMessages = messages.filter(m => m.id !== messageId);
                const lastMessage = remainingMessages[remainingMessages.length - 1];

                setConversations(prev => prev.map(conv =>
                    conv.id === selectedChat
                        ? { ...conv, lastMessage: lastMessage?.content }
                        : conv
                ));
            }

            toast.success('Mensagem apagada com sucesso');
        } catch (error) {
            console.error('Erro ao apagar mensagem:', error);
            toast.error('Erro ao apagar mensagem');
        }
    };

    const handleStartConversation = (userId: string) => {
        const existingConversation = conversations.find(c =>
            c.participants.includes(userId) && c.participants.includes(currentUser?.uid || '')
        );

        if (existingConversation) {
            setSelectedChat(existingConversation.id);
        } else {
            const newConversation: Conversation = {
                id: userId,
                participants: [currentUser?.uid || '', userId]
            };
            setConversations(prev => [...prev, newConversation]);
            setSelectedChat(userId);
        }
    };

    const handleDeleteConversation = (conversationId: string) => {
        setConversations(prev => prev.filter(c => c.id !== conversationId));
        if (selectedChat === conversationId) {
            setSelectedChat('forum');
        }
    };

    const userInitials = (name: string | undefined) => {
        if (!name) return '??';
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const getChatName = (chatId: string) => {
        if (chatId === 'forum') return 'Fórum de Avisos';
        const conversation = conversations.find(c => c.id === chatId);
        const otherParticipant = conversation?.participants.find(p => p !== currentUser?.uid);
        const user = onlineUsers.find(u => u.id === otherParticipant);
        return user?.name || 'Usuário';
    };

    const onlineUsersList = onlineUsers.filter(user => user.state === 'online');
    const offlineUsersList = onlineUsers.filter(user => user.state === 'offline');

    return (
        <div className="h-[calc(100vh-4rem)] flex relative">
            {/* Lista de Conversas */}
            <AnimatePresence>
                {showConversations && (
                    <motion.div
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        className="absolute md:relative inset-y-0 left-0 w-80 z-40"
                    >
                        <Card className="h-full flex flex-col bg-gradient-to-br from-background via-background/95 to-muted/30 backdrop-blur-sm border-primary/10 rounded-none border-r">
                            <div className="flex-none p-4 border-b border-primary/10">
                                <div className="flex items-center justify-between">
                                    <h2 className="font-semibold">Conversas</h2>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setShowSidebar(true)}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="md:hidden"
                                            onClick={() => setShowConversations(false)}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <ScrollArea className="flex-1">
                                <div className="p-2">
                                    <Button
                                        variant="ghost"
                                        className={cn(
                                            "w-full justify-start gap-3",
                                            selectedChat === 'forum' && "bg-primary/10"
                                        )}
                                        onClick={() => {
                                            setSelectedChat('forum');
                                            if (window.innerWidth < 768) setShowConversations(false);
                                        }}
                                    >
                                        <MessageSquare className="h-5 w-5 text-primary" />
                                        <span>Fórum de Avisos</span>
                                    </Button>

                                    {conversations.map((conversation) => {
                                        const otherParticipant = conversation.participants.find(p => p !== currentUser?.uid);
                                        const user = onlineUsers.find(u => u.id === otherParticipant);

                                        return (
                                            <div
                                                key={conversation.id}
                                                className="relative group"
                                            >
                                                <Button
                                                    variant="ghost"
                                                    className={cn(
                                                        "w-full justify-start gap-3",
                                                        selectedChat === conversation.id && "bg-primary/10"
                                                    )}
                                                    onClick={() => {
                                                        setSelectedChat(conversation.id);
                                                        if (window.innerWidth < 768) setShowConversations(false);
                                                    }}
                                                >
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback className="bg-primary/10 text-primary">
                                                            {userInitials(user?.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0 text-left">
                                                        <p className="font-medium truncate">{user?.name || 'Usuário'}</p>
                                                        {conversation.lastMessage && (
                                                            <p className="text-xs text-muted-foreground truncate">
                                                                {conversation.lastMessage}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {user?.state === 'online' && (
                                                        <Circle className="h-2 w-2 fill-green-500" />
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteConversation(conversation.id);
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Área principal do chat */}
            <Card className="flex-1 flex flex-col bg-gradient-to-br from-background via-background/95 to-muted/30 backdrop-blur-sm border-primary/10 rounded-none border-r-0">
                <div className="flex-none p-4 border-b border-primary/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setShowConversations(true)}
                        >
                            <MessageSquare className="h-5 w-5" />
                        </Button>
                        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
                            {getChatName(selectedChat)}
                        </h1>
                    </div>
                </div>

                <ScrollArea ref={scrollRef} className="flex-1 p-4">
                    <div className="p-4 space-y-4 max-w-3xl mx-auto">
                        <AnimatePresence>
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className={cn(
                                        "flex gap-3 group",
                                        message.userId === currentUser?.uid ? "flex-row-reverse" : ""
                                    )}
                                >
                                    <Avatar className="h-8 w-8 flex-shrink-0 ring-2 ring-primary/20">
                                        <AvatarImage src="" alt={message.userName} />
                                        <AvatarFallback className="bg-gradient-to-br from-primary to-purple-500 text-primary-foreground">
                                            {userInitials(message.userName)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div
                                        className={cn(
                                            "flex flex-col gap-1 max-w-[80%]",
                                            message.userId === currentUser?.uid ? "items-end" : ""
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                                                {message.userName}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {format(message.timestamp, "d 'de' MMMM 'às' HH:mm", {
                                                    locale: ptBR,
                                                })}
                                            </span>
                                        </div>

                                        <div
                                            className={cn(
                                                "rounded-lg p-3 relative group-hover:shadow-lg transition-shadow duration-200 break-words",
                                                message.userId === currentUser?.uid
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-muted"
                                            )}
                                        >
                                            <p className="text-sm whitespace-pre-wrap">
                                                {message.content}
                                            </p>
                                            {message.userId === currentUser?.uid && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive"
                                                            onClick={() => handleDeleteMessage(message.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Apagar mensagem
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </ScrollArea>

                <div className="flex-none p-4 border-t border-primary/10">
                    <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto">
                        <div className="flex gap-2">
                            <Input
                                ref={inputRef}
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Digite sua mensagem..."
                                className="flex-1"
                                disabled={isLoading}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={isLoading || !newMessage.trim()}
                                className="bg-primary hover:bg-primary/90"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>

            {/* Sidebar com usuários */}
            <AnimatePresence>
                {showSidebar && (
                    <motion.div
                        initial={{ x: 300 }}
                        animate={{ x: 0 }}
                        exit={{ x: 300 }}
                        className="fixed inset-y-0 right-0 w-80 bg-background border-l z-50"
                    >
                        <Card className="h-full flex flex-col bg-gradient-to-br from-background via-background/95 to-muted/30 backdrop-blur-sm border-primary/10 rounded-none">
                            <div className="flex-none p-4 border-b border-primary/10 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-primary" />
                                    <h2 className="font-semibold">Usuários</h2>
                                    <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary">
                                        {onlineUsers.length}
                                    </Badge>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowSidebar(false)}
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                            </div>

                            <div className="flex-none p-4 border-b border-primary/10">
                                <Tabs defaultValue="online" value={activeTab} onValueChange={(value) => setActiveTab(value as 'online' | 'offline')}>
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="online" className="flex items-center gap-2">
                                            <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                                            Online ({onlineUsersList.length})
                                        </TabsTrigger>
                                        <TabsTrigger value="offline" className="flex items-center gap-2">
                                            <Circle className="h-2 w-2 fill-gray-500 text-gray-500" />
                                            Offline ({offlineUsersList.length})
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>

                            <ScrollArea className="flex-1">
                                <div className="p-4 space-y-4">
                                    {(activeTab === 'online' ? onlineUsersList : offlineUsersList).map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                                            onClick={() => {
                                                handleStartConversation(user.id);
                                                setShowSidebar(false);
                                                if (window.innerWidth < 768) setShowConversations(false);
                                            }}
                                        >
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                    {userInitials(user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{user.name}</p>
                                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                            </div>
                                            <Badge
                                                variant="secondary"
                                                className={cn(
                                                    "hover:bg-opacity-20",
                                                    user.state === 'online'
                                                        ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                                        : "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
                                                )}
                                            >
                                                {user.state === 'online' ? 'Online' : 'Offline'}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Chat;