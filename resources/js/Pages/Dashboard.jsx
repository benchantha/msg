import { AppLayout } from '@/Layouts/AppLayout';
import { SectionCards } from '@/components/SectionCards';
import { ChartAreaInteractive } from '@/components/ChartAreaInteractive';
import { DashboardTable } from '@/components/DashboardTable';
import { dashboardTableData } from '@/data/dashboard-data';

export default function Dashboard() {
    return (
        <AppLayout title="Documents">
            <SectionCards />
            <ChartAreaInteractive />
            <DashboardTable data={dashboardTableData} />
        </AppLayout>
    );
}
