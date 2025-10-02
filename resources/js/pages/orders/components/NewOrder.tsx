import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { Branch, BreadcrumbItem, NewOrderForm } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeft,
    Building2,
    Calendar,
    DollarSign,
    FileText,
    MapPin,
    Package,
    Phone,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface NewOrderProps {
    orderCode?: string;
    branches?: Branch[];
}

const Breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Nueva Orden',
        href: '/orders/new',
    },
];

export const NewOrder = ({ orderCode = '', branches = [] }: NewOrderProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [clientErrors, setClientErrors] = useState<Record<string, string>>(
        {},
    );

    const { data, setData, post, errors, reset } = useForm<NewOrderForm>({
        order_code: orderCode,
        elaboration_date: new Date().toISOString().split('T')[0], // Fecha de elaboración
        delivery_date: '', // Fecha de entrega
        branch_id: 0,
        concept: '',
        total: 0,
        advance: 0,
        notes: '',
        delivery_address: '',
        contact_phone: '',
    });

    useEffect(() => {
        if (orderCode) {
            setData('order_code', orderCode);
        }
    }, [orderCode, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Limpiar errores del cliente
        setClientErrors({});

        // Validación del lado del cliente
        if (!data.branch_id || data.branch_id === 0) {
            setClientErrors({ branch_id: 'La sucursal es requerida' });
            return;
        }

        setIsSubmitting(true);

        post('/orders', {
            onFinish: () => setIsSubmitting(false),
            onSuccess: () => {
                reset();
                setClientErrors({});
                // El controlador redirigirá automáticamente
            },
        });
    };

    const handleInputChange = (
        field: keyof NewOrderForm,
        value: string | number,
    ) => {
        setData(field, value);

        // Limpiar errores del cliente cuando el usuario modifica el campo
        if (clientErrors[field]) {
            const newErrors = { ...clientErrors };
            delete newErrors[field];
            setClientErrors(newErrors);
        }
    };

    const calculatedBalance = data.total - data.advance;

    return (
        <>
            <AppLayout breadcrumbs={Breadcrumbs}>
                <Head title="Nueva Orden" />
                <div className="flex min-h-screen items-center justify-center p-4">
                    <div className="w-full max-w-2xl">
                        <div className="mb-6 text-center">
                            <div className="mb-4 flex items-center justify-center space-x-4">
                                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                                    <FileText className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                                        Nueva Orden
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {orderCode
                                            ? `Creando orden: ${orderCode}`
                                            : 'Completa los datos para crear la orden'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* Número de Orden */}
                                    <div>
                                        <label className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                            <FileText className="mr-2 h-4 w-4" />
                                            Número de Orden *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.order_code}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'order_code',
                                                    e.target.value.toUpperCase(),
                                                )
                                            }
                                            className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 focus:border-emerald-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            placeholder="ORD-001"
                                        />
                                        {errors.order_code && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.order_code}
                                            </p>
                                        )}
                                    </div>
                                    {/* Fecha */}
                                    <div>
                                        <label className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                            <Calendar className="mr-2 h-4 w-4" />
                                            Fecha de Elaboración *
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={data.elaboration_date}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'elaboration_date',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 focus:border-emerald-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        />
                                        {errors.elaboration_date && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.elaboration_date}
                                            </p>
                                        )}
                                    </div>
                                    {/* Sucursal */}
                                    <div className="col-span-2">
                                        <label className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                            <Building2 className="mr-2 h-4 w-4" />
                                            Sucursal *
                                        </label>
                                        <select
                                            required
                                            value={data.branch_id}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'branch_id',
                                                    parseInt(e.target.value),
                                                )
                                            }
                                            className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 focus:border-emerald-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value={0}>
                                                Selecciona una sucursal
                                            </option>
                                            {branches.map((branch) => (
                                                <option
                                                    key={branch.id}
                                                    value={branch.id}
                                                >
                                                    {branch.name}
                                                </option>
                                            ))}
                                        </select>
                                        {(errors.branch_id ||
                                            clientErrors.branch_id) && (
                                            <p className="mt-1 flex items-center gap-2 font-bold rounded-md bg-red-500 p-2 text-sm text-white">
                                                <AlertTriangle className="h-4 w-4" />
                                                {errors.branch_id ||
                                                    clientErrors.branch_id}
                                            </p>
                                        )}
                                    </div>
                                    {/* Fecha de Entrega */}
                                    {/* //! De mientras desabilitamos este campo */}
                                    <div className="hidden">
                                        <label className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                            <Calendar className="mr-2 h-4 w-4" />
                                            Fecha de Entrega
                                        </label>
                                        <input
                                            type="date"
                                            value={data.delivery_date}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'delivery_date',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 focus:border-emerald-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        />
                                        {errors.delivery_date && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.delivery_date}
                                            </p>
                                        )}
                                    </div>
                                    {/* Concepto */}
                                    <div className="md:col-span-2">
                                        <label className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                            <Package className="mr-2 h-4 w-4" />
                                            Concepto *
                                        </label>
                                        <textarea
                                            required
                                            value={data.concept}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'concept',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full resize-none rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 focus:border-emerald-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            rows={3}
                                            placeholder="Descripción del servicio o producto..."
                                        />
                                        {errors.concept && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.concept}
                                            </p>
                                        )}
                                    </div>
                                    {/* Total */}
                                    <div>
                                        <label className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                            <DollarSign className="mr-2 h-4 w-4" />
                                            Total *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            step="0.01"
                                            min="0.01"
                                            value={data.total}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'total',
                                                    parseFloat(
                                                        e.target.value,
                                                    ) || 0,
                                                )
                                            }
                                            className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 focus:border-emerald-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            placeholder="0.00"
                                        />
                                        {errors.total && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.total}
                                            </p>
                                        )}
                                    </div>
                                    {/* Anticipo */}
                                    <div>
                                        <label className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                            <DollarSign className="mr-2 h-4 w-4" />
                                            Anticipo *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            step="0.01"
                                            min="0"
                                            max={data.total}
                                            value={data.advance}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'advance',
                                                    parseFloat(
                                                        e.target.value,
                                                    ) || 0,
                                                )
                                            }
                                            className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 focus:border-emerald-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            placeholder="0.00"
                                        />
                                        {errors.advance && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.advance}
                                            </p>
                                        )}
                                    </div>
                                    {/* Dirección de Entrega */}
                                    <div className="hidden md:col-span-2">
                                        <label className="hiden mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                            <MapPin className="mr-2 h-4 w-4" />
                                            Dirección de Entrega
                                        </label>
                                        <input
                                            type="text"
                                            value={data.delivery_address}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'delivery_address',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 focus:border-emerald-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            placeholder="Dirección completa para entrega..."
                                        />
                                        {errors.delivery_address && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.delivery_address}
                                            </p>
                                        )}
                                    </div>
                                    {/* Teléfono de Contacto */}
                                    <div>
                                        <label className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                            <Phone className="mr-2 h-4 w-4" />
                                            Teléfono de Contacto
                                        </label>
                                        <input
                                            type="tel"
                                            value={data.contact_phone}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'contact_phone',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 focus:border-emerald-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            placeholder="9991234567"
                                        />
                                        {errors.contact_phone && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.contact_phone}
                                            </p>
                                        )}
                                    </div>
                                    {/* Observaciones */}
                                    <div>
                                        <label className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                            <FileText className="mr-2 h-4 w-4" />
                                            Observaciones
                                        </label>
                                        <textarea
                                            value={data.notes}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'notes',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full resize-none rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 focus:border-emerald-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            rows={2}
                                            placeholder="Notas adicionales..."
                                        />
                                        {errors.notes && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.notes}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Resumen Financiero */}
                                <div className="mt-6 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 p-4 dark:from-gray-700 dark:to-gray-600">
                                    <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white">
                                        Resumen Financiero
                                    </h3>
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Total
                                            </p>
                                            <p className="text-xl font-bold text-gray-800 dark:text-white">
                                                ${data.total.toFixed(2)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Anticipo
                                            </p>
                                            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                                ${data.advance.toFixed(2)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Saldo
                                            </p>
                                            <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                                                ${calculatedBalance.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Botones */}
                                <div className="mt-8 flex gap-4">
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => window.history.back()}
                                        className="flex items-center space-x-2"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        <span>Cancelar</span>
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="blueGradient"
                                        disabled={isSubmitting}
                                        className="flex-1"
                                    >
                                        {isSubmitting
                                            ? 'Creando Orden...'
                                            : 'Crear Orden'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    );
};
