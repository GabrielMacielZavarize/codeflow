import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Activity, Users, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuditLogHeaderProps {
    title: string;
    description: string;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    actionFilter: string;
    onActionFilterChange: (value: string) => void;
    entityFilter: string;
    onEntityFilterChange: (value: string) => void;
    translations: {
        filters: string;
        filtersDescription: string;
        searchPlaceholder: string;
        filterByAction: string;
        filterByEntity: string;
        allActions: string;
        allEntities: string;
        actions: {
            create: string;
            update: string;
            delete: string;
            complete: string;
            assign: string;
            login: string;
            logout: string;
        };
        entities: {
            task: string;
            user: string;
            team: string;
            system: string;
        };
    };
}

export const AuditLogHeader: React.FC<AuditLogHeaderProps> = ({
    title,
    description,
    searchTerm,
    onSearchChange,
    actionFilter,
    onActionFilterChange,
    entityFilter,
    onEntityFilterChange,
    translations
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="space-y-2"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Activity className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
                            {title}
                        </h1>
                    </div>
                    <p className="text-muted-foreground max-w-2xl">{description}</p>
                </motion.div>
            </div>

            <Card className="bg-gradient-to-br from-background via-background/95 to-muted/30 backdrop-blur-sm border border-primary/10 shadow-2xl">
                <CardHeader className="border-b border-primary/10">
                    <div className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-primary" />
                        <CardTitle className="text-xl">{translations.filters}</CardTitle>
                    </div>
                    <CardDescription>{translations.filtersDescription}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                            className="relative"
                        >
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={translations.searchPlaceholder}
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="pl-10 bg-background/50 border-primary/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                        >
                            <Select value={actionFilter} onValueChange={onActionFilterChange}>
                                <SelectTrigger className="bg-background/50 border-primary/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200">
                                    <SelectValue placeholder={translations.filterByAction} />
                                </SelectTrigger>
                                <SelectContent className="bg-background/95 backdrop-blur-sm border-primary/10">
                                    <SelectItem value="all">{translations.allActions}</SelectItem>
                                    <SelectItem value="create">{translations.actions.create}</SelectItem>
                                    <SelectItem value="update">{translations.actions.update}</SelectItem>
                                    <SelectItem value="delete">{translations.actions.delete}</SelectItem>
                                    <SelectItem value="complete">{translations.actions.complete}</SelectItem>
                                    <SelectItem value="assign">{translations.actions.assign}</SelectItem>
                                    <SelectItem value="login">{translations.actions.login}</SelectItem>
                                    <SelectItem value="logout">{translations.actions.logout}</SelectItem>
                                </SelectContent>
                            </Select>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.5 }}
                        >
                            <Select value={entityFilter} onValueChange={onEntityFilterChange}>
                                <SelectTrigger className="bg-background/50 border-primary/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200">
                                    <SelectValue placeholder={translations.filterByEntity} />
                                </SelectTrigger>
                                <SelectContent className="bg-background/95 backdrop-blur-sm border-primary/10">
                                    <SelectItem value="all">{translations.allEntities}</SelectItem>
                                    <SelectItem value="task">{translations.entities.task}</SelectItem>
                                    <SelectItem value="user">{translations.entities.user}</SelectItem>
                                    <SelectItem value="team">{translations.entities.team}</SelectItem>
                                    <SelectItem value="system">{translations.entities.system}</SelectItem>
                                </SelectContent>
                            </Select>
                        </motion.div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}; 