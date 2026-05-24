import { useEffect, useState } from 'react';
import { AppLayout } from '@/Layouts/AppLayout';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconSun, IconMoon, IconDeviceDesktop } from '@tabler/icons-react';
import { useTheme } from 'next-themes';

function ThemeToggle() {
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button variant="outline" disabled className="min-w-[140px]">
                <span className="text-muted-foreground">Loading...</span>
            </Button>
        );
    }

    const themeLabel = theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System';
    const ThemeIcon = theme === 'light' ? IconSun : theme === 'dark' ? IconMoon : IconDeviceDesktop;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[140px] justify-start gap-2">
                    <ThemeIcon className="size-4" />
                    <span>{themeLabel}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Theme</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={theme || 'system'} onValueChange={setTheme}>
                    <DropdownMenuRadioItem value="light">
                        <IconSun className="size-4 mr-2" />
                        Light
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">
                        <IconMoon className="size-4 mr-2" />
                        Dark
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system">
                        <IconDeviceDesktop className="size-4 mr-2" />
                        System
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default function Settings() {
    return (
        <AppLayout title="Settings">
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                    <p className="text-muted-foreground">
                        Manage your application settings and preferences.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                        <CardDescription>
                            Choose light or dark mode. System follows your device preference.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-0.5">
                            <p className="text-sm font-medium">Theme</p>
                            <p className="text-sm text-muted-foreground">
                                Select your preferred theme
                            </p>
                        </div>
                        <ThemeToggle />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>General</CardTitle>
                        <CardDescription>
                            General application settings and preferences.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Configure your preferences here.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Account</CardTitle>
                        <CardDescription>
                            Manage your account settings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Account settings will be available here.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
