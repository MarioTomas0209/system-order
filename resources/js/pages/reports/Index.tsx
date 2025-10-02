import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import reportRoutes from '@/routes/reports';
import { Head } from '@inertiajs/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PieChartCard from '@/components/charts/pie-chart-card';
import BarChartCard from '@/components/charts/bar-chart-card';
import LineChartCard from '@/components/charts/line-chart-card';
import AreaChartCard from '@/components/charts/area-chart-card';
import { 
    ShoppingCart, 
    CreditCard, 
    Truck, 
    Users, 
    Building2 
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: dashboard().url,
    },
    {
        title: 'Reportes',
        href: reportRoutes.index().url,
    }
];

interface ReportData {
    orders: {
        byStatus: Array<{ name: string; value: number }>;
        byMonth: Array<{ month: string; count: number }>;
        salesByMonth: Array<{ month: string; total: number; advance: number; balance: number }>;
        byBranch: Array<{ name: string; count: number }>;
    };
    payments: {
        byMethod: Array<{ name: string; value: number }>;
        totalByMethod: Array<{ name: string; total: number }>;
        byMonth: Array<{ month: string; count: number; total: number }>;
    };
    deliveries: {
        byStatus: Array<{ name: string; value: number }>;
        byMonth: Array<{ month: string; count: number }>;
        byMethod: Array<{ name: string; value: number }>;
    };
    users: {
        byStatus: Array<{ name: string; value: number }>;
        byRole: Array<{ name: string; value: number }>;
        ordersByUser: Array<{ name: string; count: number }>;
    };
    branches: {
        byStatus: Array<{ name: string; value: number }>;
        ordersByBranch: Array<{ name: string; count: number }>;
        revenueByBranch: Array<{ name: string; total: number }>;
    };
}

export default function ReportsIndex({ orders, payments, deliveries, users, branches }: ReportData) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reportes" />
            
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard de Reportes</h1>
                    <p className="text-muted-foreground mt-2">
                        Visualiza estadísticas y métricas de tu sistema de órdenes
                    </p>
                </div>

                <Tabs defaultValue="orders" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="orders" className="flex items-center gap-2">
                            <ShoppingCart className="h-4 w-4" />
                            Órdenes
                        </TabsTrigger>
                        <TabsTrigger value="payments" className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Pagos
                        </TabsTrigger>
                        <TabsTrigger value="deliveries" className="flex items-center gap-2">
                            <Truck className="h-4 w-4" />
                            Entregas
                        </TabsTrigger>
                        <TabsTrigger value="users" className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Usuarios
                        </TabsTrigger>
                        <TabsTrigger value="branches" className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Sucursales
                        </TabsTrigger>
                    </TabsList>

                    {/* Órdenes */}
                    <TabsContent value="orders" className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <PieChartCard
                                title="Órdenes por Estado"
                                description="Distribución de órdenes según su estado actual"
                                data={orders.byStatus}
                            />
                            <BarChartCard
                                title="Órdenes por Sucursal"
                                description="Cantidad de órdenes por cada sucursal"
                                data={orders.byBranch}
                                dataKeys={[{ key: 'count', name: 'Cantidad', color: '#3b82f6' }]}
                                xAxisKey="name"
                            />
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            <LineChartCard
                                title="Órdenes por Mes"
                                description="Evolución mensual de órdenes creadas"
                                data={orders.byMonth}
                                dataKeys={[{ key: 'count', name: 'Órdenes', color: '#3b82f6' }]}
                                xAxisKey="month"
                            />
                            <AreaChartCard
                                title="Ventas Mensuales"
                                description="Total, anticipos y saldos por mes"
                                data={orders.salesByMonth}
                                dataKeys={[
                                    { key: 'total', name: 'Total', color: '#3b82f6' },
                                    { key: 'advance', name: 'Anticipos', color: '#10b981' },
                                    { key: 'balance', name: 'Saldos', color: '#f59e0b' }
                                ]}
                                xAxisKey="month"
                            />
                        </div>
                    </TabsContent>

                    {/* Pagos */}
                    <TabsContent value="payments" className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <PieChartCard
                                title="Pagos por Método"
                                description="Distribución de pagos según método de pago"
                                data={payments.byMethod}
                            />
                            <BarChartCard
                                title="Total Recaudado por Método"
                                description="Monto total recaudado por cada método"
                                data={payments.totalByMethod}
                                dataKeys={[{ key: 'total', name: 'Total ($)', color: '#10b981' }]}
                                xAxisKey="name"
                            />
                        </div>
                        <div className="grid gap-6">
                            <BarChartCard
                                title="Pagos por Mes"
                                description="Cantidad y monto total de pagos mensuales"
                                data={payments.byMonth}
                                dataKeys={[
                                    { key: 'count', name: 'Cantidad', color: '#3b82f6' },
                                    { key: 'total', name: 'Total ($)', color: '#10b981' }
                                ]}
                                xAxisKey="month"
                            />
                        </div>
                    </TabsContent>

                    {/* Entregas */}
                    <TabsContent value="deliveries" className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <PieChartCard
                                title="Entregas por Estado"
                                description="Distribución de entregas según su estado"
                                data={deliveries.byStatus}
                            />
                            <PieChartCard
                                title="Entregas por Método"
                                description="Distribución según método de entrega"
                                data={deliveries.byMethod}
                            />
                        </div>
                        <div className="grid gap-6">
                            <LineChartCard
                                title="Entregas por Mes"
                                description="Evolución mensual de entregas realizadas"
                                data={deliveries.byMonth}
                                dataKeys={[{ key: 'count', name: 'Entregas', color: '#10b981' }]}
                                xAxisKey="month"
                            />
                        </div>
                    </TabsContent>

                    {/* Usuarios */}
                    <TabsContent value="users" className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <PieChartCard
                                title="Usuarios por Estado"
                                description="Distribución de usuarios activos e inactivos"
                                data={users.byStatus}
                            />
                            <PieChartCard
                                title="Usuarios por Rol"
                                description="Distribución entre administradores y usuarios"
                                data={users.byRole}
                            />
                        </div>
                        <div className="grid gap-6">
                            <BarChartCard
                                title="Top 10 - Órdenes Creadas por Usuario"
                                description="Usuarios más productivos en creación de órdenes"
                                data={users.ordersByUser}
                                dataKeys={[{ key: 'count', name: 'Órdenes Creadas', color: '#8b5cf6' }]}
                                xAxisKey="name"
                            />
                        </div>
                    </TabsContent>

                    {/* Sucursales */}
                    <TabsContent value="branches" className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <PieChartCard
                                title="Sucursales por Estado"
                                description="Distribución de sucursales activas e inactivas"
                                data={branches.byStatus}
                            />
                            <BarChartCard
                                title="Órdenes por Sucursal"
                                description="Cantidad de órdenes gestionadas por sucursal"
                                data={branches.ordersByBranch}
                                dataKeys={[{ key: 'count', name: 'Órdenes', color: '#3b82f6' }]}
                                xAxisKey="name"
                            />
                        </div>
                        <div className="grid gap-6">
                            <BarChartCard
                                title="Ingresos por Sucursal"
                                description="Total de ingresos generados por cada sucursal"
                                data={branches.revenueByBranch}
                                dataKeys={[{ key: 'total', name: 'Ingresos ($)', color: '#10b981' }]}
                                xAxisKey="name"
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
