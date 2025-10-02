import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getColorForIndex } from './chart-config';

interface AreaChartCardProps {
    title: string;
    description?: string;
    data: any[];
    dataKeys: { key: string; name: string; color?: string }[];
    xAxisKey: string;
}

export default function AreaChartCard({ title, description, data, dataKeys, xAxisKey }: AreaChartCardProps) {
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <p className="font-medium mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: ${typeof entry.value === 'number' ? entry.value.toLocaleString('es-MX', { minimumFractionDigits: 2 }) : entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                            <XAxis 
                                dataKey={xAxisKey} 
                                className="text-xs"
                                tick={{ fill: 'currentColor' }}
                            />
                            <YAxis 
                                className="text-xs"
                                tick={{ fill: 'currentColor' }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            {dataKeys.map((key, index) => (
                                <Area 
                                    key={key.key}
                                    type="monotone" 
                                    dataKey={key.key} 
                                    name={key.name}
                                    stroke={key.color || getColorForIndex(index)}
                                    fill={key.color || getColorForIndex(index)}
                                    fillOpacity={0.6}
                                />
                            ))}
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

