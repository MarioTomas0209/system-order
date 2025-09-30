import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    ArrowLeft, 
    Calendar, 
    DollarSign, 
    Building2, 
    FileText, 
    MapPin, 
    Phone,
    Save,
    X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { BreadcrumbItem, Order, Branch } from '@/types';

interface EditOrderProps {
    order: Order;
    branches: Branch[];
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
    {
        title: 'Editar Orden',
        href: '#',
    },
];

export default function EditOrder({ order, branches }: EditOrderProps) {
    const { data, setData, put, processing, errors } = useForm({
        order_code: order.order_code,
        elaboration_date: order.created_date,
        delivery_date: order.delivery_date || '',
        concept: order.concept,
        total: order.total,
        advance: order.advance,
        status: order.status,
        notes: order.notes || '',
        delivery_address: order.delivery_address || '',
        contact_phone: order.contact_phone || '',
        branch_id: order.branch_id,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/orders/${order.id}`);
    };

    const handleInputChange = (field: string, value: any) => {
        setData(field as keyof typeof data, value);
    };

    const balance = data.total - data.advance;

    const statusOptions = [
        { value: 'en_elaboracion', label: 'En Elaboración', color: 'bg-blue-100 text-blue-800' },
        { value: 'entregada', label: 'Entregada', color: 'bg-emerald-100 text-emerald-800' },
        { value: 'cancelada', label: 'Cancelada', color: 'bg-red-100 text-red-800' },
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Orden" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href="/orders">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Volver
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Editar Orden</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Modifica los datos de la orden {order.order_code}
                            </p>
                        </div>
                    </div>
                    
                    <Badge className={`${statusOptions.find(s => s.value === data.status)?.color || 'bg-gray-100 text-gray-800'}`}>
                        {statusOptions.find(s => s.value === data.status)?.label || data.status}
                    </Badge>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Información Básica */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                <FileText className="w-5 h-5 mr-2" />
                                Información Básica
                            </h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="order_code">Código de Orden</Label>
                                    <Input
                                        id="order_code"
                                        value={data.order_code}
                                        onChange={(e) => handleInputChange('order_code', e.target.value)}
                                        className={errors.order_code ? 'border-red-500' : ''}
                                        placeholder="ORD-001"
                                    />
                                    {errors.order_code && (
                                        <p className="text-red-500 text-sm mt-1">{errors.order_code}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="elaboration_date">Fecha de Elaboración</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <Input
                                                id="elaboration_date"
                                                type="date"
                                                value={data.elaboration_date}
                                                onChange={(e) => handleInputChange('elaboration_date', e.target.value)}
                                                className={`pl-10 ${errors.elaboration_date ? 'border-red-500' : ''}`}
                                            />
                                        </div>
                                        {errors.elaboration_date && (
                                            <p className="text-red-500 text-sm mt-1">{errors.elaboration_date}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="delivery_date">Fecha de Entrega</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <Input
                                                id="delivery_date"
                                                type="date"
                                                value={data.delivery_date}
                                                onChange={(e) => handleInputChange('delivery_date', e.target.value)}
                                                className={`pl-10 ${errors.delivery_date ? 'border-red-500' : ''}`}
                                            />
                                        </div>
                                        {errors.delivery_date && (
                                            <p className="text-red-500 text-sm mt-1">{errors.delivery_date}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="concept">Concepto</Label>
                                    <Input
                                        id="concept"
                                        value={data.concept}
                                        onChange={(e) => handleInputChange('concept', e.target.value)}
                                        className={errors.concept ? 'border-red-500' : ''}
                                        placeholder="Descripción del producto o servicio"
                                    />
                                    {errors.concept && (
                                        <p className="text-red-500 text-sm mt-1">{errors.concept}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="branch_id">Sucursal</Label>
                                    <select
                                        id="branch_id"
                                        value={data.branch_id}
                                        onChange={(e) => handleInputChange('branch_id', parseInt(e.target.value))}
                                        className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                                            errors.branch_id ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                    >
                                        <option value="">Seleccionar sucursal</option>
                                        {branches.map((branch) => (
                                            <option key={branch.id} value={branch.id}>
                                                {branch.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.branch_id && (
                                        <p className="text-red-500 text-sm mt-1">{errors.branch_id}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="status">Estado</Label>
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => handleInputChange('status', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                                            errors.status ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                    >
                                        {statusOptions.map((status) => (
                                            <option key={status.value} value={status.value}>
                                                {status.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.status && (
                                        <p className="text-red-500 text-sm mt-1">{errors.status}</p>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Información Financiera */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                <DollarSign className="w-5 h-5 mr-2" />
                                Información Financiera
                            </h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="total">Total</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            id="total"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.total}
                                            onChange={(e) => handleInputChange('total', parseFloat(e.target.value) || 0)}
                                            className={`pl-10 ${errors.total ? 'border-red-500' : ''}`}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    {errors.total && (
                                        <p className="text-red-500 text-sm mt-1">{errors.total}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="advance">Anticipo</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            id="advance"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.advance}
                                            onChange={(e) => handleInputChange('advance', parseFloat(e.target.value) || 0)}
                                            className={`pl-10 ${errors.advance ? 'border-red-500' : ''}`}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    {errors.advance && (
                                        <p className="text-red-500 text-sm mt-1">{errors.advance}</p>
                                    )}
                                </div>

                                {/* Resumen Financiero */}
                                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Resumen</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Total:</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {formatCurrency(data.total)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Anticipo:</span>
                                            <span className="font-medium text-blue-600 dark:text-blue-400">
                                                {formatCurrency(data.advance)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between border-t pt-2">
                                            <span className="text-gray-600 dark:text-gray-400">Saldo:</span>
                                            <span className={`font-medium ${
                                                balance > 0 
                                                    ? 'text-orange-600 dark:text-orange-400' 
                                                    : 'text-green-600 dark:text-green-400'
                                            }`}>
                                                {formatCurrency(balance)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Información Adicional */}
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <MapPin className="w-5 h-5 mr-2" />
                            Información Adicional
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="delivery_address">Dirección de Entrega</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                                    <Textarea
                                        id="delivery_address"
                                        value={data.delivery_address}
                                        onChange={(e) => handleInputChange('delivery_address', e.target.value)}
                                        className={`pl-10 ${errors.delivery_address ? 'border-red-500' : ''}`}
                                        rows={3}
                                        placeholder="Dirección completa de entrega..."
                                    />
                                </div>
                                {errors.delivery_address && (
                                    <p className="text-red-500 text-sm mt-1">{errors.delivery_address}</p>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="contact_phone">Teléfono de Contacto</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            id="contact_phone"
                                            value={data.contact_phone}
                                            onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                                            className={`pl-10 ${errors.contact_phone ? 'border-red-500' : ''}`}
                                            placeholder="555-123-4567"
                                        />
                                    </div>
                                    {errors.contact_phone && (
                                        <p className="text-red-500 text-sm mt-1">{errors.contact_phone}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="notes">Notas</Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => handleInputChange('notes', e.target.value)}
                                        className={errors.notes ? 'border-red-500' : ''}
                                        rows={3}
                                        placeholder="Notas adicionales sobre la orden..."
                                    />
                                    {errors.notes && (
                                        <p className="text-red-500 text-sm mt-1">{errors.notes}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Botones de Acción */}
                    <div className="flex justify-end space-x-4">
                        <Link href="/orders">
                            <Button variant="outline" disabled={processing}>
                                <X className="w-4 h-4 mr-2" />
                                Cancelar
                            </Button>
                        </Link>
                        <Button 
                            type="submit" 
                            disabled={processing}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {processing ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
