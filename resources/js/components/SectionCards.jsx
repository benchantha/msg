import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

const cards = [
    {
        title: 'Total Revenue',
        value: '$1,250.00',
        change: '+12.5%',
        trend: 'up',
        description: 'Trending up this month',
        footer: 'Visitors for the last 6 months',
    },
    {
        title: 'New Customers',
        value: '1,234',
        change: '-20%',
        trend: 'down',
        description: 'Down 20% this period',
        footer: 'Acquisition needs attention',
    },
    {
        title: 'Active Accounts',
        value: '45,678',
        change: '+12.5%',
        trend: 'up',
        description: 'Strong user retention',
        footer: 'Engagement exceed targets',
    },
    {
        title: 'Growth Rate',
        value: '4.5%',
        change: '+4.5%',
        trend: 'up',
        description: 'Steady performance increase',
        footer: 'Meets growth projections',
    },
];

export function SectionCards() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
                <Card key={card.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {card.title}
                        </CardTitle>
                        <Badge
                            variant={card.trend === 'up' ? 'default' : 'secondary'}
                            className="gap-1 text-xs"
                        >
                            {card.trend === 'up' ? (
                                <IconTrendingUp className="size-3" />
                            ) : (
                                <IconTrendingDown className="size-3" />
                            )}
                            {card.change}
                        </Badge>
                    </CardHeader>
                    <CardContent className="pb-2">
                        <div className="text-2xl font-bold">{card.value}</div>
                        <p className="text-xs text-muted-foreground">
                            {card.description}
                        </p>
                    </CardContent>
                    <CardFooter className="pt-0">
                        <CardDescription className="text-xs">
                            {card.footer}
                        </CardDescription>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
