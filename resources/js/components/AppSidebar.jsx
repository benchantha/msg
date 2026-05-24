import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    IconLayoutDashboard,
    IconUser,
    IconLogout,
    IconCirclePlus,
    IconMail,
    IconListDetails,
    IconChartBar,
    IconFolder,
    IconUsers,
    IconDatabase,
    IconReport,
    IconFileText,
    IconDots,
    IconSettings,
    IconHelp,
    IconSearch,
    IconDotsVertical,
    IconChevronRight,
    IconCreditCard,
    IconNotification,
    IconComponents,
    IconPackage,
} from '@tabler/icons-react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarInput,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const appName = import.meta.env.VITE_APP_NAME || 'Acme Inc.';

export function AppSidebar(props) {
    const { url } = usePage();
    const auth = usePage().props.auth;

    const navMain = [
        { title: 'Dashboard', href: '/dashboard', icon: IconLayoutDashboard },
        {
            title: 'Master',
            icon: IconFolder,
            items: [
                { title: 'Company', href: '/company', icon: IconUsers },
                { title: 'Client', href: '/clients' },
                { title: 'Vehicle Type', href: '/vehicle-types' },
                { title: 'Driver Vehicles', href: '/driver-vehicles' }
                ],
        },{
            title: 'Operations',
            icon: IconPackage,
            items: [
                { title: 'Orders', href: '/orders' },
            ],
        },
    ];

    const navSecondary = [
        { title: 'Settings', href: '/settings', icon: IconSettings },
    ];

    // Determine which parent should be open based on current URL on initial render
    const initialOpenNavItem =
        navMain.find(
            (item) =>
                Array.isArray(item.items) &&
                item.items.some((subItem) => url.startsWith(subItem.href)),
        )?.title ?? null;

    const [openNavItem, setOpenNavItem] = useState(initialOpenNavItem);

    const user = {
        name: auth?.user?.name ?? 'shadcn',
        email: auth?.user?.email ?? 'm@example.com',
        avatar: '',
    };

    return (
        <Sidebar collapsible="icon" variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="!p-0 overflow-hidden">
                            <Link href="/dashboard" className="flex w-full h-full items-center">
                                <span
                                    className="bg-white text-black flex items-center justify-center font-semibold size-8 rounded-md text-lg shrink-0
                                        group-data-[collapsible=icon]:!size-full group-data-[collapsible=icon]:!rounded-none"
                                >
                                    {appName.charAt(0)}
                                </span>
                                <span className="font-semibold ml-2 truncate group-data-[collapsible=icon]:hidden">
                                    {appName}
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Main</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navMain.map((item) => {
                                const hasChildren = Array.isArray(item.items) && item.items.length > 0;
                                const isOpen = hasChildren && openNavItem === item.title;

                                return (
                                    <SidebarMenuItem key={item.title} className="relative">
                                        {hasChildren ? (
                                            <SidebarMenuButton
                                                className="flex w-full items-center justify-between gap-2"
                                                onClick={() =>
                                                    setOpenNavItem(isOpen ? null : item.title)
                                                }
                                            >
                                                <span className="flex items-center gap-2">
                                                    <item.icon className="size-4" />
                                                    <span>{item.title}</span>
                                                </span>
                                                <IconChevronRight
                                                    className={
                                                        'size-3.5 transition-transform text-muted-foreground ' +
                                                        (isOpen ? 'rotate-90' : '')
                                                    }
                                                />
                                            </SidebarMenuButton>
                                        ) : (
                                            <SidebarMenuButton
                                                asChild
                                                isActive={url.startsWith(item.href)}
                                            >
                                                <Link href={item.href}>
                                                    <item.icon className="size-4" />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        )}

                                        {hasChildren && isOpen && (
                                            <>
                                                {/* Vertical connector line under main menu icon */}
                                                <div className="pointer-events-none absolute left-4 top-6 bottom-1 w-px bg-border group-data-[collapsible=icon]:hidden" />
                                                <div className="mt-1 pl-7 group-data-[collapsible=icon]:hidden">
                                                    <SidebarMenu className="space-y-0">
                                                        {item.items.map((subItem) => (
                                                            <SidebarMenuItem key={subItem.title}>
                                                                <SidebarMenuButton
                                                                    asChild
                                                                    isActive={url.startsWith(subItem.href)}
                                                                >
                                                                    <Link href={subItem.href}>
                                                                        <span>{subItem.title}</span>
                                                                    </Link>
                                                                </SidebarMenuButton>
                                                            </SidebarMenuItem>
                                                        ))}
                                                    </SidebarMenu>
                                                </div>
                                            </>
                                        )}
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Settings</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navSecondary.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={url.startsWith(item.href)}
                                    >
                                        <Link href={item.href}>
                                            <item.icon className="size-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground !p-0 overflow-hidden">
                                    <Avatar className="h-8 w-8 rounded-lg shrink-0 group-data-[collapsible=icon]:!size-full group-data-[collapsible=icon]:!rounded-none group-data-[collapsible=icon]:rounded-none">
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback className="rounded-lg font-semibold [.group[data-collapsible=icon]_&]:bg-white [.group[data-collapsible=icon]_&]:text-black [.group[data-collapsible=icon]_&]:rounded-none">
                                            {user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'CN'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden min-w-0">
                                        <span className="truncate font-semibold">{user.name}</span>
                                        <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                                    </div>
                                    <IconDotsVertical className="size-4 shrink-0 group-data-[collapsible=icon]:hidden" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg" side="left" align="end" sideOffset={4}>
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                            <AvatarFallback className="rounded-lg">{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">{user.name}</span>
                                            <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <IconCreditCard className="size-4" />
                                        Billing
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <IconNotification className="size-4" />
                                        Notifications
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/logout" method="post" as="button" className="w-full">
                                        <IconLogout className="size-4" />
                                        Log out
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
