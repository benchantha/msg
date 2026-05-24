import { Link, useForm } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

export default function Login({ status }) {
    const { data, setData, post, processing, errors, transform } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    // Ensure the "remember" value is sent in the same
    // format Laravel Fortify expects from a classic form.
    transform((data) => ({
        ...data,
        remember: data.remember ? 'on' : '',
    }));

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-semibold tracking-tight">
                            Log in
                        </CardTitle>
                        <CardDescription>
                            Enter your email and password to sign in.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            {status && (
                                <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400">
                                    {status}
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    autoComplete="username"
                                    autoFocus
                                    className={cn(errors.email && 'border-destructive')}
                                    aria-invalid={!!errors.email}
                                />
                                {errors.email && (
                                    <p className="text-sm text-destructive">{errors.email}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    autoComplete="current-password"
                                    className={cn(errors.password && 'border-destructive')}
                                    aria-invalid={!!errors.password}
                                />
                                {errors.password && (
                                    <p className="text-sm text-destructive">{errors.password}</p>
                                )}
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    checked={data.remember}
                                    onCheckedChange={(checked) =>
                                        setData('remember', checked === true)
                                    }
                                />
                                <Label
                                    htmlFor="remember"
                                    className="text-sm font-normal text-muted-foreground cursor-pointer"
                                >
                                    Remember me
                                </Label>
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                disabled={processing}
                            >
                                {processing ? 'Signing in...' : 'Sign in'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
