import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type {
    BreadcrumbItem,
    DeliveryForm,
    Order,
    PayAndDeliverForm,
    PaymentForm,
} from '@/types';
import { Head, useForm } from '@inertiajs/react';
import {
    Building2,
    Calendar,
    CheckCircle,
    CreditCard,
    DollarSign,
    FileText,
    MapPin,
    Package,
    Phone,
    Truck,
    User,
    XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

// Declarar la función route global
declare global {
    function route(name: string, params?: any): string;
}

const Breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Seguimiento de Orden',
        href: '/orders/follow-up',
    },
];

interface FollowUpProps {
    order: Order;
    totalPaid: number;
    remainingBalance: number;
}

export const FollowUp = ({
    order,
    totalPaid,
    remainingBalance,
}: FollowUpProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionType, setActionType] = useState<
        'pay' | 'deliver' | 'pay-deliver' | null
    >(null);

    // Función helper para convertir valores a números
    const toNumber = (value: any): number => {
        if (typeof value === 'number') return value;
        if (typeof value === 'string') return parseFloat(value) || 0;
        return 0;
    };

    // Convertir valores de la orden a números
    const orderTotal = toNumber(order.total);
    const orderAdvance = toNumber(order.advance);
    const orderBalance = toNumber(order.balance);
    const totalPaidNum = toNumber(totalPaid);
    const remainingBalanceNum = toNumber(remainingBalance);

    // Formulario para pagos
    const {
        data: paymentData,
        setData: setPaymentData,
        post: postPayment,
        errors: paymentErrors,
        reset: resetPayment,
    } = useForm<PaymentForm>({
        payment_date: new Date().toISOString().split('T')[0],
        amount: remainingBalanceNum,
        method: 'efectivo',
        notes: '',
    });

    // Formulario para entregas
    const {
        data: deliveryData,
        setData: setDeliveryData,
        post: postDelivery,
        errors: deliveryErrors,
        reset: resetDelivery,
    } = useForm<DeliveryForm>({
        delivery_date: new Date().toISOString().split('T')[0],
        status: 'entregado',
        comments: '',
        tracking_number: '',
        delivery_method: 'entrega_directa',
    });

    // Formulario para pagar y entregar
    const {
        data: payDeliverData,
        setData: setPayDeliverData,
        post: postPayDeliver,
        errors: payDeliverErrors,
        reset: resetPayDeliver,
    } = useForm<PayAndDeliverForm>({
        payment_date: new Date().toISOString().split('T')[0],
        amount: remainingBalanceNum,
        method: 'efectivo',
        notes: '',
        delivery_date: new Date().toISOString().split('T')[0],
        delivery_comments: '',
    });

    useEffect(() => {
        // Actualizar el monto del pago cuando cambie el saldo restante
        setPaymentData('amount', remainingBalanceNum);
        setPayDeliverData('amount', remainingBalanceNum);
    }, [remainingBalanceNum, setPaymentData, setPayDeliverData]);

    const handleAction = (action: 'pay' | 'deliver' | 'pay-deliver') => {
        setActionType(action);
        // Los formularios se mostrarán automáticamente basados en actionType
    };

    const handlePayOnly = () => {
        setIsSubmitting(true);
        postPayment(`/orders/${order.id}/pay`, {
            onFinish: () => {
                setIsSubmitting(false);
                setActionType(null);
            },
            onSuccess: () => {
                resetPayment();
            },
        });
    };

    const handleDeliverOnly = () => {
        setIsSubmitting(true);
        postDelivery(`/orders/${order.id}/deliver`, {
            onFinish: () => {
                setIsSubmitting(false);
                setActionType(null);
            },
            onSuccess: () => {
                resetDelivery();
            },
        });
    };

    const handlePayAndDeliver = () => {
        setIsSubmitting(true);
        postPayDeliver(`/orders/${order.id}/pay-deliver`, {
            onFinish: () => {
                setIsSubmitting(false);
                setActionType(null);
            },
            onSuccess: () => {
                resetPayDeliver();
            },
        });
    };

    const isDelivered =
        order.deliveries &&
        order.deliveries.some((delivery) => delivery.status === 'entregado');
    const paymentPercentage =
        orderTotal > 0 ? (totalPaidNum / orderTotal) * 100 : 0;

    return (
        <>
            <AppLayout breadcrumbs={Breadcrumbs}>
                <Head title="Seguimiento de Orden" />
                <div className="min-h-screen p-4 py-8">
                    <div className="mx-auto max-w-4xl">
                        {/* Header */}
                        <div className="mb-6 text-center">
                            <div className="mb-4 flex items-center justify-center space-x-4">
                                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                                    <Package className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-white">
                                        Seguimiento de Orden
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {order.order_code}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Información de la Orden */}
                        <div className="mb-6 rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
                            <h2 className="mb-4 flex items-center text-xl font-bold text-gray-800 dark:text-white">
                                <FileText className="mr-2 h-5 w-5" />
                                Información de la Orden
                            </h2>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div>
                                    <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <Building2 className="mr-2 h-4 w-4" />
                                        Sucursal
                                    </p>
                                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                                        {order.branch?.name ||
                                            'No especificada'}
                                    </p>
                                </div>
                                <div>
                                    <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Fecha de Elaboración
                                    </p>
                                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                                        {order.created_date
                                            ? new Date(
                                                  order.created_date +
                                                      'T00:00:00',
                                              ).toLocaleDateString('es-ES')
                                            : 'No especificada'}
                                    </p>
                                </div>
                                <div>
                                    <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Fecha de Entregado
                                    </p>
                                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                                        {order.delivery_date
                                            ? new Date(
                                                  order.delivery_date +
                                                      'T00:00:00',
                                              ).toLocaleDateString('es-ES')
                                            : 'Sin fecha'}
                                    </p>
                                </div>
                                <div>
                                    <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <Package className="mr-2 h-4 w-4" />
                                        Concepto
                                    </p>
                                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                                        {order.concept}
                                    </p>
                                </div>
                                {order.delivery_address && (
                                    <div>
                                        <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                            <MapPin className="mr-2 h-4 w-4" />
                                            Dirección de Entrega
                                        </p>
                                        <p className="text-lg font-semibold text-gray-800 dark:text-white">
                                            {order.delivery_address}
                                        </p>
                                    </div>
                                )}
                                {order.contact_phone && (
                                    <div>
                                        <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                            <Phone className="mr-2 h-4 w-4" />
                                            Teléfono de Contacto
                                        </p>
                                        <p className="text-lg font-semibold text-gray-800 dark:text-white">
                                            {order.contact_phone}
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <User className="mr-2 h-4 w-4" />
                                        Estado
                                    </p>
                                    <Badge
                                        className={`${order.status_badge_color || 'bg-gray-100 text-gray-800'}`}
                                    >
                                        {order.status_label || order.status}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <User className="mr-2 h-4 w-4" />
                                        Creado por
                                    </p>
                                    <Badge
                                        className={`${order.creator?.name ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                                    >
                                        {order.creator?.name ||
                                            order.creator?.email}
                                    </Badge>
                                </div>
                            </div>

                            {/* Estado de entrega */}
                            {isDelivered && (
                                <div className="mt-4 flex items-center rounded-xl bg-green-100 p-4 dark:bg-green-900">
                                    <CheckCircle className="mr-3 h-6 w-6 text-green-600 dark:text-green-300" />
                                    <span className="font-semibold text-green-800 dark:text-green-200">
                                        Orden entregada
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Resumen Financiero */}
                        <div className="mb-6 rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
                            <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">
                                Resumen Financiero
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        Total
                                    </span>
                                    <span className="text-2xl font-bold text-gray-800 dark:text-white">
                                        ${orderTotal.toFixed(2)}
                                    </span>
                                </div>

                                <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                    <div
                                        className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all duration-500"
                                        style={{
                                            width: `${Math.min(paymentPercentage, 100)}%`,
                                        }}
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="rounded-xl bg-blue-50 p-3 dark:bg-gray-700">
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Anticipo
                                        </p>
                                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                            ${orderAdvance.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-green-50 p-3 dark:bg-gray-700">
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Pagado
                                        </p>
                                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                            ${totalPaidNum.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-orange-50 p-3 dark:bg-gray-700">
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Saldo
                                        </p>
                                        <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                                            ${remainingBalanceNum.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Captura de Acciones */}
                        {!isDelivered && (
                            <div className="mb-6 rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
                                <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">
                                    Acciones de Seguimiento
                                </h2>

                                {/* Formulario de Pago */}
                                {(actionType === 'pay' ||
                                    actionType === 'pay-deliver') && (
                                    <div className="mb-6 rounded-xl bg-blue-50 p-4 dark:bg-blue-900">
                                        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
                                            Datos del Pago
                                        </h3>
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div>
                                                <label className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    <Calendar className="mr-2 h-4 w-4" />
                                                    Fecha de Pago
                                                </label>
                                                <input
                                                    type="date"
                                                    value={
                                                        actionType === 'pay'
                                                            ? paymentData.payment_date
                                                            : payDeliverData.payment_date
                                                    }
                                                    onChange={(e) => {
                                                        if (
                                                            actionType === 'pay'
                                                        ) {
                                                            setPaymentData(
                                                                'payment_date',
                                                                e.target.value,
                                                            );
                                                        } else {
                                                            setPayDeliverData(
                                                                'payment_date',
                                                                e.target.value,
                                                            );
                                                        }
                                                    }}
                                                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    <DollarSign className="mr-2 h-4 w-4" />
                                                    Monto
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0.01"
                                                    max={remainingBalance}
                                                    value={
                                                        actionType === 'pay'
                                                            ? paymentData.amount
                                                            : payDeliverData.amount
                                                    }
                                                    onChange={(e) => {
                                                        const amount =
                                                            parseFloat(
                                                                e.target.value,
                                                            ) || 0;
                                                        if (
                                                            actionType === 'pay'
                                                        ) {
                                                            setPaymentData(
                                                                'amount',
                                                                amount,
                                                            );
                                                        } else {
                                                            setPayDeliverData(
                                                                'amount',
                                                                amount,
                                                            );
                                                        }
                                                    }}
                                                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    <CreditCard className="mr-2 h-4 w-4" />
                                                    Método de Pago
                                                </label>
                                                <select
                                                    value={
                                                        actionType === 'pay'
                                                            ? paymentData.method
                                                            : payDeliverData.method
                                                    }
                                                    onChange={(e) => {
                                                        if (
                                                            actionType === 'pay'
                                                        ) {
                                                            setPaymentData(
                                                                'method',
                                                                e.target
                                                                    .value as
                                                                    | 'efectivo'
                                                                    | 'tarjeta'
                                                                    | 'transferencia',
                                                            );
                                                        } else {
                                                            setPayDeliverData(
                                                                'method',
                                                                e.target
                                                                    .value as
                                                                    | 'efectivo'
                                                                    | 'tarjeta'
                                                                    | 'transferencia',
                                                            );
                                                        }
                                                    }}
                                                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                >
                                                    <option value="efectivo">
                                                        Efectivo
                                                    </option>
                                                    <option value="tarjeta">
                                                        Tarjeta
                                                    </option>
                                                    <option value="transferencia">
                                                        Transferencia
                                                    </option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    <FileText className="mr-2 h-4 w-4" />
                                                    Notas del Pago
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        actionType === 'pay'
                                                            ? paymentData.notes ||
                                                              ''
                                                            : payDeliverData.notes ||
                                                              ''
                                                    }
                                                    onChange={(e) => {
                                                        if (
                                                            actionType === 'pay'
                                                        ) {
                                                            setPaymentData(
                                                                'notes',
                                                                e.target.value,
                                                            );
                                                        } else {
                                                            setPayDeliverData(
                                                                'notes',
                                                                e.target.value,
                                                            );
                                                        }
                                                    }}
                                                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                    placeholder="Observaciones del pago..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Formulario de Entrega */}
                                {(actionType === 'deliver' ||
                                    actionType === 'pay-deliver') && (
                                    <div className="mb-6 rounded-xl bg-green-50 p-4 dark:bg-green-900">
                                        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
                                            Datos de la Entrega
                                        </h3>
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div>
                                                <label className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    <Calendar className="mr-2 h-4 w-4" />
                                                    Fecha de Entrega
                                                </label>
                                                <input
                                                    type="date"
                                                    value={
                                                        actionType === 'deliver'
                                                            ? deliveryData.delivery_date
                                                            : payDeliverData.delivery_date
                                                    }
                                                    onChange={(e) => {
                                                        if (
                                                            actionType ===
                                                            'deliver'
                                                        ) {
                                                            setDeliveryData(
                                                                'delivery_date',
                                                                e.target.value,
                                                            );
                                                        } else {
                                                            setPayDeliverData(
                                                                'delivery_date',
                                                                e.target.value,
                                                            );
                                                        }
                                                    }}
                                                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    <Truck className="mr-2 h-4 w-4" />
                                                    Estado de Entrega
                                                </label>
                                                <select
                                                    value={deliveryData.status}
                                                    onChange={(e) =>
                                                        setDeliveryData(
                                                            'status',
                                                            e.target.value as
                                                                | 'entregado'
                                                                | 'parcial',
                                                        )
                                                    }
                                                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                >
                                                    <option value="entregado">
                                                        Entregado
                                                    </option>
                                                    <option value="parcial">
                                                        Entrega Parcial
                                                    </option>
                                                </select>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    <FileText className="mr-2 h-4 w-4" />
                                                    Comentarios de Entrega
                                                </label>
                                                <textarea
                                                    value={
                                                        actionType === 'deliver'
                                                            ? deliveryData.comments ||
                                                              ''
                                                            : payDeliverData.delivery_comments ||
                                                              ''
                                                    }
                                                    onChange={(e) => {
                                                        if (
                                                            actionType ===
                                                            'deliver'
                                                        ) {
                                                            setDeliveryData(
                                                                'comments',
                                                                e.target.value,
                                                            );
                                                        } else {
                                                            setPayDeliverData(
                                                                'delivery_comments',
                                                                e.target.value,
                                                            );
                                                        }
                                                    }}
                                                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                    rows={2}
                                                    placeholder="Observaciones de la entrega..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Botones de Acción - Solo mostrar si no hay acción seleccionada */}
                                {!actionType && (
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                        <Button
                                            onClick={() =>
                                                handleAction('pay-deliver')
                                            }
                                            disabled={
                                                isSubmitting || isDelivered
                                            }
                                            className="flex transform items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:from-green-600 hover:to-emerald-700"
                                        >
                                            <CheckCircle className="h-5 w-5" />
                                            Pagar y Entregar
                                        </Button>

                                        <Button
                                            onClick={() => handleAction('pay')}
                                            disabled={isSubmitting}
                                            className="flex transform items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:from-blue-600 hover:to-indigo-700"
                                        >
                                            <CreditCard className="h-5 w-5" />
                                            Solo Pagar
                                        </Button>

                                        <Button
                                            onClick={() =>
                                                handleAction('deliver')
                                            }
                                            disabled={
                                                isSubmitting || isDelivered
                                            }
                                            className="flex transform items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:from-purple-600 hover:to-pink-700"
                                        >
                                            <Truck className="h-5 w-5" />
                                            Solo Entregar
                                        </Button>
                                    </div>
                                )}

                                {/* Botones de Confirmación - Solo mostrar si hay acción seleccionada */}
                                {actionType && (
                                    <div className="flex justify-center gap-4">
                                        <Button
                                            onClick={() => {
                                                switch (actionType) {
                                                    case 'pay':
                                                        handlePayOnly();
                                                        break;
                                                    case 'deliver':
                                                        handleDeliverOnly();
                                                        break;
                                                    case 'pay-deliver':
                                                        handlePayAndDeliver();
                                                        break;
                                                }
                                            }}
                                            disabled={isSubmitting}
                                            className="flex transform items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:from-green-600 hover:to-emerald-700"
                                        >
                                            <CheckCircle className="h-5 w-5" />
                                            {isSubmitting
                                                ? 'Procesando...'
                                                : 'Confirmar'}
                                        </Button>

                                        <Button
                                            onClick={() => setActionType(null)}
                                            disabled={isSubmitting}
                                            variant="outline"
                                            className="flex items-center justify-center gap-2 rounded-xl border-2 border-gray-300 px-8 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            <XCircle className="h-5 w-5" />
                                            Cancelar
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Historial de Pagos */}
                        {order.payments && order.payments.length > 0 && (
                            <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
                                <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">
                                    Historial de Pagos
                                </h2>
                                <div className="space-y-3">
                                    {order.payments.map((payment, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-gray-700"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <span className="text-gray-600 dark:text-gray-300">
                                                    {new Date(
                                                        payment.payment_date,
                                                    ).toLocaleDateString(
                                                        'es-ES',
                                                    )}
                                                </span>
                                                <Badge
                                                    variant="secondary"
                                                    className="text-xs"
                                                >
                                                    {payment.method_label ||
                                                        payment.method}
                                                </Badge>
                                            </div>
                                            <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                                +$
                                                {toNumber(
                                                    payment.amount,
                                                ).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </AppLayout>
        </>
    );
};
