import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import BranchModal from '@/components/BranchModal';
import branchRoutes from '@/routes/branches';
import type { BreadcrumbItem, Branch } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Building2, Edit, Trash2, Eye, MapPin, Phone, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
    {
        title: 'Sucursales',
        href: branchRoutes.index().url,
    },
];

interface BranchesIndexProps {
    branches: {
        data: Branch[];
        links: any[];
        meta: any;
    };
}

export default function BranchesIndex({ branches }: BranchesIndexProps) {
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

    const handleDelete = (branchId: number) => {
        if (confirm('¿Estás seguro de que quieres eliminar esta sucursal?')) {
            setDeletingId(branchId);
            router.delete(branchRoutes.destroy({ branch: branchId }).url, {
                onFinish: () => setDeletingId(null),
            });
        }
    };

    const handleCreate = () => {
        setSelectedBranch(null);
        setModalMode('create');
        setModalOpen(true);
    };

    const handleEdit = (branch: Branch) => {
        setSelectedBranch(branch);
        setModalMode('edit');
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedBranch(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sucursales" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6 sm:p-0">
                    <div className="w-full sm:w-auto">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Sucursales</h1>
                        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                            Gestiona las sucursales de tu empresa
                        </p>
                    </div>
                    <div className="w-full sm:w-auto flex justify-start sm:justify-end">
                        <Button
                            variant="blueGradient"
                            onClick={handleCreate}
                            className="w-full sm:w-auto flex items-center justify-center"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva Sucursal
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Sucursales
                            </CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{branches.meta?.total || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Página Actual
                            </CardTitle>
                            <Badge variant="secondary">{branches.meta?.current_page || 1}</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {branches.data?.length || 0} de {branches.meta?.total || 0}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Branches Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Sucursales</CardTitle>
                        <CardDescription>
                            Todas las sucursales registradas en el sistema
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {branches.data && branches.data.length > 0 ? (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Nombre</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead>Dirección</TableHead>
                                            <TableHead>Teléfono</TableHead>
                                            <TableHead>Fecha Creación</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {branches.data.map((branch) => (
                                            <TableRow key={branch.id}>
                                                <TableCell className="font-medium">
                                                    #{branch.id}
                                                </TableCell>
                                                <TableCell className="font-semibold">
                                                    {branch.name}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        {branch.is_active ? (
                                                            <>
                                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                                <Badge variant="default" className="bg-green-100 text-green-800">
                                                                    Activa
                                                                </Badge>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <XCircle className="h-4 w-4 text-red-500" />
                                                                <Badge variant="secondary" className="bg-red-100 text-red-800">
                                                                    Inactiva
                                                                </Badge>
                                                            </>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {branch.address ? (
                                                        <div className="flex items-center space-x-2">
                                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                                            <span className="max-w-[200px] truncate">
                                                                {branch.address}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {branch.phone ? (
                                                        <div className="flex items-center space-x-2">
                                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                                            <span>{branch.phone}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(branch.created_at).toLocaleDateString('es-ES')}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <Link href={branchRoutes.show({ branch: branch.id }).url}>
                                                            <Button variant="ghost" size="sm">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm"
                                                            onClick={() => handleEdit(branch)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm"
                                                            onClick={() => handleDelete(branch.id)}
                                                            disabled={deletingId === branch.id}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {/* Pagination */}
                                {branches.links && branches.links.length > 3 && (
                                    <div className="flex items-center justify-center space-x-2 mt-6">
                                        {branches.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                                    link.active
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                                }`}
                                            >
                                                {link.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No hay sucursales</h3>
                                <p className="text-muted-foreground text-center mb-4">
                                    Comienza creando tu primera sucursal para organizar tu negocio.
                                </p>
                                <Button onClick={handleCreate}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Crear Primera Sucursal
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Modal */}
                <BranchModal
                    isOpen={modalOpen}
                    onClose={handleModalClose}
                    branch={selectedBranch}
                    mode={modalMode}
                />
            </div>
        </AppLayout>
    );
}
