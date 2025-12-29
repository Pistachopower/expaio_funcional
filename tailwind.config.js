/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#ff6600",
                "primary-dark": "#e65c00",
                "background-light": "#ffffff",
                "background-dark": "#09090b",
                "surface-light": "#f8f9fa",
                "surface-dark": "#18181b",
                "card-dark": "#27272a",
                "danger": "#ef4444",
                "danger-bg": "#fef2f2",
                "warning": "#f97316",
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "2xl": "1rem",
                "full": "9999px"
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/container-queries'),
    ],
}
