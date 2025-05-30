import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';

interface LineChartCardProps {
    data: Array<{
        date: string;
        taxa: number;
    }>;
    title: string;
    description?: string;
}

const LineChartCard: React.FC<LineChartCardProps> = ({ data, title, description }) => {
    return (
        <ChartCard title={title} description={description}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <defs>
                        <linearGradient id="colorTaxa" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.2} />
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
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            padding: '12px'
                        }}
                        formatter={(value) => [`${value}%`, 'Taxa de Conclusão']}
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
                    <Line
                        type="monotone"
                        dataKey="taxa"
                        name="Taxa de Conclusão"
                        stroke="#8B5CF6"
                        strokeWidth={2}
                        dot={{ fill: '#8B5CF6', strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: '#8B5CF6' }}
                        animationDuration={1000}
                        animationBegin={0}
                    />
                </LineChart>
            </ResponsiveContainer>
        </ChartCard>
    );
};

export default LineChartCard; 