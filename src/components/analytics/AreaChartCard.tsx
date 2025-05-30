import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';

interface AreaChartCardProps {
    data: Array<{
        date: string;
        criadas: number;
        concluidas: number;
    }>;
    title: string;
    description?: string;
}

const AreaChartCard: React.FC<AreaChartCardProps> = ({ data, title, description }) => {
    // Se não houver dados ou todos os valores forem 0, retorna uma mensagem
    if (!data.length || data.every(item => item.criadas === 0 && item.concluidas === 0)) {
        return (
            <ChartCard title={title} description={description}>
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 dark:text-gray-400">Ainda não possui dados para este gráfico</p>
                </div>
            </ChartCard>
        );
    }

    return (
        <ChartCard title={title} description={description}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <defs>
                        <linearGradient id="colorCriadas" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.2} />
                        </linearGradient>
                        <linearGradient id="colorConcluidas" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.2} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e5e7eb"
                        vertical={false}
                    />
                    <XAxis
                        dataKey="date"
                        stroke="#6b7280"
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <YAxis
                        stroke="#6b7280"
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            padding: '12px'
                        }}
                        formatter={(value, name) => [`${value} tarefas`, name]}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value) => (
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                {value}
                            </span>
                        )}
                    />
                    <Area
                        type="monotone"
                        dataKey="criadas"
                        name="Criadas"
                        stroke="#8B5CF6"
                        fill="url(#colorCriadas)"
                        strokeWidth={2}
                        animationDuration={1000}
                        animationBegin={0}
                    />
                    <Area
                        type="monotone"
                        dataKey="concluidas"
                        name="Concluídas"
                        stroke="#10B981"
                        fill="url(#colorConcluidas)"
                        strokeWidth={2}
                        animationDuration={1000}
                        animationBegin={200}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </ChartCard>
    );
};

export default AreaChartCard; 