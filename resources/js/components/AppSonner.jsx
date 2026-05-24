import { Toaster } from '@/components/ui/sonner';
import { toast as baseToast } from 'sonner';

// Global toast component – mount once in your root layout (e.g. app.jsx)
export function AppSonner() {
    return (
        <Toaster
            position="top-right"
            richColors
            toastOptions={{
                className:
                    'rounded-2xl border border-border/60 bg-background/80 px-4 py-3 text-sm shadow-lg',
            }}
        />
    );
}

// Convenience helpers
export const toast = {
    success: (message, options) =>
        baseToast.success(message, options),
    error: (message, options) =>
        baseToast.error(message, options),
    warning: (message, options) =>
        baseToast.warning?.(message, options) ?? baseToast(message, { ...options, type: 'warning' }),
    info: (message, options) =>
        baseToast.info?.(message, options) ?? baseToast(message, options),
};

