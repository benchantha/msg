import { AppSidebar } from '@/components/AppSidebar';
import { SiteHeader } from '@/components/SiteHeader';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export function AppLayout({ title, children, subHeader }) {
    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                }
            }
        >
            <AppSidebar />
            <SidebarInset className="min-h-0">
                <SiteHeader title={title} subHeader={subHeader} />
                <div className="min-h-0 flex-1 overflow-auto">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                            {children}
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
