import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

// Nombres legibles para cada ruta
const pageNames: Record<string, string> = {
    '/': 'Inicio',
    '/checklist': 'Checklist',
    '/safety': 'Seguridad',
    '/directory': 'Directorio',
    '/calculator': 'Calculadora',
    '/chat': 'Asistente IA',
    '/consultas': 'Mis Consultas',
    '/profile': 'Mi Perfil',
    '/about': 'Sobre Nosotros',
    '/admin': 'Panel Admin',
    '/audios-integracion': 'Integración',
    '/guia-inicial': 'Guía Inicial',
};

export const usePageTracker = () => {
    const location = useLocation();
    const { user } = useAuth();
    const enterTime = useRef<number>(Date.now());
    const prevPage = useRef<string>('');

    useEffect(() => {
        const currentPage = location.pathname;

        // Log previous page duration
        if (user && prevPage.current && prevPage.current !== currentPage) {
            const duration = Math.round((Date.now() - enterTime.current) / 1000);
            if (duration >= 2) { // Solo trackear si estuvo al menos 2 seg
                const pageName = pageNames[prevPage.current] || prevPage.current;
                supabase.from('eventos_pagina').insert({
                    usuario_id: user.id,
                    pagina: pageName,
                    duracion_seg: duration,
                }).then(() => {}); // Fire and forget
            }
        }

        // Reset for new page
        prevPage.current = currentPage;
        enterTime.current = Date.now();

        // Log on page unload (user closes tab)
        const handleUnload = () => {
            if (!user) return;
            const duration = Math.round((Date.now() - enterTime.current) / 1000);
            if (duration >= 2) {
                const pageName = pageNames[currentPage] || currentPage;
                // Use sendBeacon for reliability on unload
                const payload = JSON.stringify({
                    usuario_id: user.id,
                    pagina: pageName,
                    duracion_seg: duration,
                });
                navigator.sendBeacon(
                    `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/eventos_pagina`,
                    new Blob([payload], { type: 'application/json' })
                );
            }
        };

        window.addEventListener('beforeunload', handleUnload);
        return () => window.removeEventListener('beforeunload', handleUnload);
    }, [location.pathname, user]);
};
