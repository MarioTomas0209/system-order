import { useAppearance } from '@/hooks/use-appearance';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
    const { appearance, updateAppearance } = useAppearance();

    const toggleTheme = () => {
        // Alternar entre light y dark (saltando system)
        const newTheme = appearance === 'light' ? 'dark' : 'light';
        updateAppearance(newTheme);
    };

    return (
        <button
            onClick={toggleTheme}
            className="group relative inline-flex items-center justify-center rounded-lg border-2 border-gray-300 p-2.5 text-gray-600 transition-all duration-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 hover:scale-105 dark:border-gray-600 dark:text-gray-400 dark:hover:border-blue-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
            title={`Cambiar a modo ${appearance === 'light' ? 'oscuro' : 'claro'}`}
        >
            {appearance === 'light' ? (
                <Moon className="h-5 w-5" />
            ) : (
                <Sun className="h-5 w-5" />
            )}
        </button>
    );
}
