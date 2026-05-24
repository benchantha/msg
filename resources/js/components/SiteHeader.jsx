import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

export function SiteHeader({ title = 'Documents', subHeader }) {
    return (
        <>
            <header className="sticky top-0 z-20 flex h-12 shrink-0 items-center gap-2 border-b bg-background transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex flex-1 items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <span className="font-semibold text-lg">{title}</span>
                </div>
                <div className="px-4">
                    {/* Reserved for future header actions */}
                </div>
            </header>

            {subHeader && (
                <div className="sticky top-12 z-10 bg-background">
                    <div className="px-5 py-5">{subHeader}</div>
                </div>
            )}
        </>
    );
}
