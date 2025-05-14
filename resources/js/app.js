import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createApp, h } from 'vue';
import { ZiggyVue } from '../../vendor/tightenco/ziggy';

const appName = import.meta.env.VITE_APP_NAME || 'PWD NA TO';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.vue`,
            import.meta.glob('./Pages/**/*.vue'),
        ),
    setup({ el, App, props, plugin }) {
        const vueApp = createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(ZiggyVue);

        vueApp.mount(el);
    },
    progress: {
        color: '#4B5563',
    },
});

// ✅ Register service worker for PWA support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/serviceworker.js').then((registration) => {
            console.log('✅ Service Worker registered:', registration.scope);

            registration.onupdatefound = () => {
                const newWorker = registration.installing;
                newWorker.onstatechange = () => {
                    if (newWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            // A new version is available
                            if (confirm('A new version of the app is available. Reload now?')) {
                                window.location.reload();
                            }
                        }
                    }
                };
            };
        }).catch((err) => {
            console.error('❌ Service Worker registration failed:', err);
        });
    });
}
