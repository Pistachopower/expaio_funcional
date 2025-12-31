import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export const ThemeToggle: React.FC = () => {
    // Force a fresh check of the theme
    const [isDark, setIsDark] = useState(() => {
        try {
            const saved = localStorage.getItem('theme');
            if (saved) return saved === 'dark';
        } catch (e) { }
        return document.documentElement.classList.contains('dark') ||
            (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            root.classList.remove('light');
            try { localStorage.setItem('theme', 'dark'); } catch (e) { }
        } else {
            root.classList.add('light');
            root.classList.remove('dark');
            try { localStorage.setItem('theme', 'light'); } catch (e) { }
        }
        console.log('[ThemeToggle] Mode applied:', isDark ? 'DARK' : 'LIGHT');
    }, [isDark]);

    const button = (
        <button
            type="button"
            onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDark(!isDark);
            }}
            className="fixed top-6 right-6 z-[20000] bg-white dark:bg-[#11211a] text-gray-800 dark:text-primary p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-200 dark:border-white/10 hover:scale-110 active:scale-90 transition-all cursor-pointer pointer-events-auto flex items-center justify-center"
            title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
            <span className="material-symbols-outlined text-3xl transition-transform pointer-events-none">
                {isDark ? 'light_mode' : 'dark_mode'}
            </span>
        </button>
    );

    return createPortal(button, document.body);
};
