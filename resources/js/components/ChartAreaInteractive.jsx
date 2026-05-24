import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const chartData = [
    { date: '2024-04-01', desktop: 222, mobile: 150 },
    { date: '2024-04-07', desktop: 245, mobile: 180 },
    { date: '2024-04-14', desktop: 137, mobile: 220 },
    { date: '2024-04-21', desktop: 137, mobile: 200 },
    { date: '2024-04-28', desktop: 122, mobile: 180 },
    { date: '2024-05-05', desktop: 481, mobile: 390 },
    { date: '2024-05-12', desktop: 197, mobile: 240 },
    { date: '2024-05-19', desktop: 235, mobile: 180 },
    { date: '2024-05-26', desktop: 213, mobile: 170 },
    { date: '2024-06-02', desktop: 470, mobile: 410 },
    { date: '2024-06-09', desktop: 438, mobile: 480 },
    { date: '2024-06-16', desktop: 371, mobile: 310 },
    { date: '2024-06-23', desktop: 480, mobile: 530 },
    { date: '2024-06-30', desktop: 446, mobile: 400 },
];

const chartConfig = {
    visitors: { label: 'Visitors' },
    desktop: { label: 'Desktop', color: 'var(--primary)' },
    mobile: { label: 'Mobile', color: 'var(--primary)' },
};

export function ChartAreaInteractive() {
    const [timeRange, setTimeRange] = React.useState('90d');

    const filteredData = React.useMemo(() => {
        const referenceDate = new Date('2024-06-30');
        let days = 90;
        if (timeRange === '30d') days = 30;
        else if (timeRange === '7d') days = 7;
        const start = new Date(referenceDate);
        start.setDate(start.getDate() - days);
        return chartData.filter((item) => new Date(item.date) >= start);
    }, [timeRange]);

    return (
        <Card>
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <CardTitle>Total Visitors</CardTitle>
                    <CardDescription>Total for the last 3 months</CardDescription>
                </div>
                <Tabs value={timeRange} onValueChange={setTimeRange} className="w-full sm:w-auto">
                    <TabsList className="grid w-full grid-cols-3 sm:inline-grid">
                        <TabsTrigger value="90d" className="text-xs">
                            Last 3 months
                        </TabsTrigger>
                        <TabsTrigger value="30d" className="text-xs">
                            Last 30 days
                        </TabsTrigger>
                        <TabsTrigger value="7d" className="text-xs">
                            Last 7 days
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <AreaChart data={filteredData} margin={{ left: 0, right: 0 }}>
                        <defs>
                            <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            }}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) =>
                                        new Date(value).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                        })
                                    }
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            type="monotone"
                            dataKey="desktop"
                            stroke="var(--color-desktop)"
                            fill="url(#fillDesktop)"
                            strokeWidth={2}
                        />
                        <Area
                            type="monotone"
                            dataKey="mobile"
                            stroke="var(--color-mobile)"
                            fill="url(#fillMobile)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
