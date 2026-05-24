import './bootstrap';
import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { AppSonner } from '@/components/AppSonner';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.jsx', { eager: true });
        return pages[`./pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <>
                    <App {...props} />
                    <AppSonner />
                </>
            </ThemeProvider>
        );
    },
    progress: {
        color: '#4B5563',
        showSpinner: true,
    },
});
