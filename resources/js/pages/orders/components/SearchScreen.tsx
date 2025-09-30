import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { PackageIcon, Search } from 'lucide-react';
import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';

// Declarar la función route global
declare global {
    function route(name: string, params?: any): string;
}

interface SearchScreenProps {
    onOrderFound?: (order: any) => void;
    onOrderNotFound?: (orderCode: string) => void;
}

const SearchScreen = ({ onOrderFound, onOrderNotFound }: SearchScreenProps) => {
    const [searchValue, setSearchValue] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const { data, setData, post, errors, clearErrors } = useForm({
        order_code: '',
    });

    const handleSearch = () => {
        if (!searchValue.trim()) {
            return;
        }

        // Limpiar errores previos y establecer el valor
        clearErrors();
        setData('order_code', searchValue.trim());
        setIsSearching(true);
        
        post('/orders/search', {
            onFinish: () => setIsSearching(false),
            onError: () => setIsSearching(false),
        });
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <>
            <div className="flex mt-10 items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                            <PackageIcon className="h-10 w-10 text-white" />
                        </div>
                        <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-white">
                            Seguimiento de Órdenes
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Ingresa el número de orden para comenzar
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-xl backdrop-blur-lg dark:bg-gray-800">
                        <div className="relative mb-4">
                            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                            <input
                                type="text"
                                placeholder="Número de orden (ej: ORD-001)"
                                value={searchValue}
                                onChange={(e) => {
                                    setSearchValue(e.target.value);
                                    setData('order_code', e.target.value);
                                    // Limpiar errores cuando el usuario escribe
                                    if (errors.order_code) {
                                        clearErrors();
                                    }
                                }}
                                onKeyPress={handleKeyPress}
                                className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 py-4 pr-4 pl-12 text-gray-800 transition-colors focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
                                disabled={isSearching}
                            />
                        </div>

                        {errors.order_code && searchValue.trim() && (
                            <p className="mb-4 text-sm text-red-500">{errors.order_code}</p>
                        )}

                        <Button
                            className='w-full'
                            variant="blueGradient"
                            onClick={handleSearch}
                            size="lg"
                            disabled={isSearching || !searchValue.trim()}
                        >
                            {isSearching ? 'Buscando...' : 'Buscar Orden'}
                        </Button>

                        <div className="mt-6 rounded-xl bg-blue-50 p-4 dark:bg-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-semibold">
                                    💡 Prueba con:
                                </span>{' '}
                                ORD-001, ORD-002 o cualquier código
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SearchScreen;
