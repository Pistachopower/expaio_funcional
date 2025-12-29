import React, { useEffect, useState } from 'react';

export const ThemeToggle: React.FC = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDark(true);
        }
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            root.classList.remove('light');
        } else {
            root.classList.add('light');
            root.classList.remove('dark');
        }
    }, [isDark]);

    return (
        <button
            onClick={() => setIsDark(!isDark)}
            className="fixed top-4 right-4 z-50 bg-white/90 dark:bg-black/50 backdrop-blur text-gray-800 dark:text-white p-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-110 transition-transform"
            title="Toggle Dark Mode"
        >
            <span className="material-symbols-outlined text-lg">
                {isDark ? 'light_mode' : 'dark_mode'}
            </span>
        </button>
    );
};
