import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Search, 
    Filter, 
    Plus, 
    Eye, 
    Edit, 
    Trash2, 
    Calendar, 
    DollarSign, 
    Building2, 
    Phone,
    Package,
    Truck,
    CheckCircle,
    Clock,
    AlertCircle,
    XCircle,
    User,
    UserCheck,
    Copy,
    Check
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { BreadcrumbItem, Order, Branch } from '@/types';

interface OrdersIndexProps {
    orders: {
        data: Order[];
        links: any[];
        meta: any;
    };
    branches: Branch[];
    filters: {
        status?: string;
        branch_id?: string;
        search?: string;
    };
    statusOptions: Record<string, string>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
    {
        title: 'Órdenes',
        href: '/orders',
    },
];

export default function OrdersIndex({ orders, branches, filters, statusOptions }: OrdersIndexProps) {
    const [searchValue, setSearchValue] = useState(filters.search || '');
    const [showFilters, setShowFilters] = useState(false);
    const [copiedOrderId, setCopiedOrderId] = useState<number | null>(null);

    const handleSearch = () => {
        router.get('/orders', {
            search: searchValue,
            status: filters.status,
            branch_id: filters.branch_id,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleCopyOrderCode = async (orderCode: string, orderId: number) => {
        try {
            await navigator.clipboard.writeText(orderCode);
            setCopiedOrderId(orderId);
            setTimeout(() => {
                setCopiedOrderId(null);
            }, 2000);
        } catch (err) {
            console.error('Error al copiar:', err);
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get('/orders', {
            ...filters,
            [key]: value || undefined,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        router.get('/orders', {}, {
            preserveState: true,
            replace: true,
        });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'en_elaboracion':
                return <Clock className="w-4 h-4" />;
            case 'entregada':
                return <Package className="w-4 h-4" />;
            case 'cancelada':
                return <XCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'en_elaboracion':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'entregada':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'cancelada':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Sin fecha';
        
        // Debug temporal - ver qué formato llega
        console.log('Date string received:', dateString, 'Type:', typeof dateString);
        
        try {
            // Si la fecha viene en formato YYYY-MM-DD, agregar tiempo local
            if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
                const date = new Date(dateString + 'T00:00:00');
                return date.toLocaleDateString('es-MX');
            }
            
            // Si ya tiene formato ISO completo
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                console.error('Invalid date:', dateString);
                return 'Fecha inválida';
            }
            
            return date.toLocaleDateString('es-MX');
        } catch (error) {
            console.error('Error formatting date:', dateString, error);
            return 'Fecha inválida';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Órdenes" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Órdenes</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Gestiona todas las órdenes del sistema
                        </p>
                    </div>
                    <Link href="/dashboard">
                        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            Nueva Orden
                        </Button>
                    </Link>
                </div>

                {/* Filtros y Búsqueda */}
                <Card className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Búsqueda */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Buscar por código, concepto o teléfono..."
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Botón de filtros */}
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden"
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            Filtros
                        </Button>

                        {/* Botón de búsqueda */}
                        <Button onClick={handleSearch}>
                            <Search className="w-4 h-4 mr-2" />
                            Buscar
                        </Button>
                    </div>

                    {/* Filtros expandibles */}
                    {(showFilters || window.innerWidth >= 1024) && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Filtro por estado */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Estado
                                </label>
                                <select
                                    value={filters.status || ''}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="">Todos los estados</option>
                                    {Object.entries(statusOptions).map(([value, label]) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Filtro por sucursal */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Sucursal
                                </label>
                                <select
                                    value={filters.branch_id || ''}
                                    onChange={(e) => handleFilterChange('branch_id', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="">Todas las sucursales</option>
                                    {branches.map((branch) => (
                                        <option key={branch.id} value={branch.id}>
                                            {branch.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Botón limpiar filtros */}
                            <div className="flex items-end">
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                    className="w-full"
                                >
                                    Limpiar Filtros
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Tabla de órdenes */}
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Orden
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Concepto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Sucursal
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Pagado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Saldo
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Fecha Elaboración
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Fecha Entrega
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Creado por
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Modificado por
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                {orders.data.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                                                    <Package className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="ml-4">
                                                    <div 
                                                        className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center gap-2"
                                                        onClick={() => handleCopyOrderCode(order.order_code, order.id)}
                                                        title="Hacer clic para copiar"
                                                    >
                                                        {order.order_code}
                                                        {copiedOrderId === order.id ? (
                                                            <Check className="w-4 h-4 text-green-500" />
                                                        ) : (
                                                            <Copy className="w-4 h-4 text-gray-400 hover:text-purple-600" />
                                                        )}
                                                    </div>
                                                    {order.contact_phone && (
                                                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                                            <Phone className="w-3 h-3 mr-1" />
                                                            {order.contact_phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                                                {order.concept}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-900 dark:text-white">
                                                <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                                                {order.branch?.name || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge className={`${getStatusColor(order.status)} border`}>
                                                <span className="flex items-center">
                                                    {getStatusIcon(order.status)}
                                                    <span className="ml-1">
                                                        {statusOptions[order.status] || order.status}
                                                    </span>
                                                </span>
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {formatCurrency(order.total)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                                                {formatCurrency(order.total_paid || 0)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`text-sm font-medium ${
                                                (order.remaining_balance || 0) > 0 
                                                    ? 'text-orange-600 dark:text-orange-400' 
                                                    : 'text-green-600 dark:text-green-400'
                                            }`}>
                                                {formatCurrency(order.remaining_balance || 0)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {formatDate(order.created_date)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {order.delivery_date ? formatDate(order.delivery_date) : 'Sin fecha'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-900 dark:text-white">
                                                <User className="w-4 h-4 mr-2 text-blue-500" />
                                                <div>
                                                    <div className="font-medium">{order.creator?.name || 'N/A'}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {order.creator?.email || ''}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-900 dark:text-white">
                                                <UserCheck className="w-4 h-4 mr-2 text-green-500" />
                                                <div>
                                                    <div className="font-medium">{order.updater?.name || 'Sin modificaciones'}</div>
                                                    {order.updater && (
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {order.updater.email}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <Link
                                                    href={`/orders/search`}
                                                    method="post"
                                                    data={{ order_code: order.order_code }}
                                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                    title="Ver detalles"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/orders/${order.id}/edit`}
                                                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                                    title="Editar orden"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación */}
                    {orders.meta && orders.links && (
                        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                    Mostrando {orders.meta.from || 0} a {orders.meta.to || 0} de {orders.meta.total || 0} resultados
                                </div>
                                <div className="flex space-x-2">
                                    {orders.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-3 py-1 text-sm rounded-md ${
                                                link.active
                                                    ? 'bg-purple-600 text-white'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                            } ${!link.url ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Estado vacío */}
                {orders.data.length === 0 && (
                    <Card className="p-12 text-center">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No hay órdenes
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            No se encontraron órdenes con los filtros aplicados.
                        </p>
                        <Link href="/dashboard">
                            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                                <Plus className="w-4 h-4 mr-2" />
                                Crear Primera Orden
                            </Button>
                        </Link>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
