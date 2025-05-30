import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartCardProps {
    title: string;
    children: ReactNode;
    height?: string;
    description?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({
    title,
    children,
    height = '300px',
    description
}) => {
    return (
        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b border-primary/10">
                <div className="space-y-1">
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        {title}
                    </CardTitle>
                    {description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {description}
                        </p>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div
                    style={{ height }}
                    className="w-full bg-gradient-to-br from-background/50 via-background/30 to-muted/30 rounded-lg p-4"
                >
                    {children}
                </div>
            </CardContent>
        </Card>
    );
};

export default ChartCard; 