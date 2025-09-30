import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BranchModal from '@/components/BranchModal';
import branchRoutes from '@/routes/branches';
import { type BreadcrumbItem, type Branch } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Building2, MapPin, Phone, Calendar, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

interface BranchShowProps {
    branch: Branch;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
    {
        title: 'Sucursales',
        href: branchRoutes.index().url,
    },
    {
        title: 'Detalles',
        href: '#',
    },
];

export default function BranchShow({ branch }: BranchShowProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleEdit = () => {
        setModalOpen(true);
    };

    const handleDelete = () => {
        if (confirm('¿Estás seguro de que quieres eliminar esta sucursal?')) {
            setDeleting(true);
            router.delete(branchRoutes.destroy({ branch: branch.id }).url, {
                onFinish: () => setDeleting(false),
                onSuccess: () => {
                    // Redirigir al índice después de eliminar
                    router.visit(branchRoutes.index().url);
                },
            });
        }
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={branch.name} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href={branchRoutes.index().url}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Volver
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{branch.name}</h1>
                            <p className="text-muted-foreground">
                                Detalles de la sucursal
                            </p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <Button variant="outline" onClick={handleEdit}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                        </Button>
                    </div>
                </div>

                {/* Main Info */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Branch Details */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Building2 className="h-5 w-5" />
                                    <span>Información de la Sucursal</span>
                                </CardTitle>
                                <CardDescription>
                                    Datos principales de la sucursal
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                            ID de Sucursal
                                        </h4>
                                        <p className="text-lg font-semibold">{branch.id}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                            Nombre
                                        </h4>
                                        <p className="text-lg font-semibold">{branch.name}</p>
                                    </div>
                                </div>

                                {/* Estado */}
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-muted-foreground">
                                        Estado de la Sucursal
                                    </h4>
                                    <div className="flex items-center space-x-2">
                                        {branch.is_active ? (
                                            <>
                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                                <Badge variant="default" className="bg-green-100 text-green-800">
                                                    Sucursal Activa
                                                </Badge>
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="h-5 w-5 text-red-500" />
                                                <Badge variant="secondary" className="bg-red-100 text-red-800">
                                                    Sucursal Inactiva
                                                </Badge>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {branch.address && (
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-muted-foreground flex items-center">
                                            <MapPin className="mr-2 h-4 w-4" />
                                            Dirección
                                        </h4>
                                        <p className="text-base">{branch.address}</p>
                                    </div>
                                )}

                                {branch.phone && (
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-muted-foreground flex items-center">
                                            <Phone className="mr-2 h-4 w-4" />
                                            Teléfono
                                        </h4>
                                        <p className="text-base">{branch.phone}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Información del Sistema</CardTitle>
                                <CardDescription>
                                    Datos de registro y actualización
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-muted-foreground flex items-center">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Fecha de Creación
                                    </h4>
                                    <p className="text-sm">
                                        {new Date(branch.created_at).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-muted-foreground flex items-center">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Última Actualización
                                    </h4>
                                    <p className="text-sm">
                                        {new Date(branch.updated_at).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Acciones Rápidas</CardTitle>
                                <CardDescription>
                                    Gestiona esta sucursal
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button 
                                    variant="outline" 
                                    className="w-full justify-start"
                                    onClick={handleEdit}
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar Sucursal
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="w-full justify-start text-red-600 hover:text-red-700"
                                    onClick={handleDelete}
                                    disabled={deleting}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    {deleting ? 'Eliminando...' : 'Eliminar Sucursal'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Modal */}
                <BranchModal
                    isOpen={modalOpen}
                    onClose={handleModalClose}
                    branch={branch}
                    mode="edit"
                />
            </div>
        </AppLayout>
    );
}
