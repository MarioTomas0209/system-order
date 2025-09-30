import type { BreadcrumbItem, User } from '@/types';

import { dashboard } from '@/routes';
import users from '@/routes/users';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { UserForm } from './dialogs/UserForm';
import { UsersTable } from './components/UsersTable';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { useState } from 'react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Toast } from '@/components/app/ui';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: dashboard().url,
    },
    {
        title: 'Usuarios',
        href: users.index().url,
    },
];

interface Props {
    users: User[];
}

export default function UsersIndex({ users }: Props) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setIsFormOpen(true);
    };

    const handleDeleteUser = (user: User) => {
        setDeletingUser(user);
        setIsDeleteDialogOpen(true);
    };

    const confirmDeleteUser = () => {
        if (deletingUser) {
            router.delete(`/users/${deletingUser.id}`, {
                onSuccess: () => {
                    setDeletingUser(null);
                    setIsDeleteDialogOpen(false);
                },
                onError: (e) => {
                    Toast.error(e.orders);
                    setDeletingUser(null);
                    setIsDeleteDialogOpen(false);
                },
            });
        }
    };

    const cancelDeleteUser = () => {
        setDeletingUser(null);
        setIsDeleteDialogOpen(false);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setEditingUser(null);
    };

    const handleFormSuccess = () => {
        handleFormClose();
        router.reload();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Usuarios" />

            <div className="min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                    <Users className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                        Gestión de Usuarios
                                    </h1>
                                    <p className="text-gray-600 mt-1 dark:text-gray-400">
                                        Administra los usuarios del sistema
                                    </p>
                                </div>
                            </div>
                            <Button
                                onClick={() => setIsFormOpen(true)}
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Nuevo Usuario
                            </Button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Usuarios</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{users.length}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Users className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </div>
                        <div className="rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Usuarios Activos</p>
                                    <p className="text-3xl font-bold text-green-600">
                                        {users.filter(user => user.is_active).length}
                                    </p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <div className="h-6 w-6 rounded-full bg-green-500"></div>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Inactivos</p>
                                    <p className="text-3xl font-bold text-orange-600">
                                        {users.filter(user => !user.is_active).length}
                                    </p>
                                </div>
                                <div className="p-3 bg-orange-100 rounded-lg">
                                    <div className="h-6 w-6 rounded-full bg-orange-500"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <UsersTable
                            users={users}
                            onEdit={handleEditUser}
                            onDelete={handleDeleteUser}
                        />
                    </div>
                </div>

                {/* User Form Dialog */}
                <UserForm
                    isOpen={isFormOpen}
                    onClose={handleFormClose}
                    onSuccess={handleFormSuccess}
                    user={editingUser}
                />

                {/* Delete Confirmation Dialog */}
                <ConfirmationDialog
                    isOpen={isDeleteDialogOpen}
                    onClose={cancelDeleteUser}
                    onConfirm={confirmDeleteUser}
                    title="Eliminar Usuario"
                    description={`¿Estás seguro de que quieres eliminar a ${deletingUser?.name}? Esta acción no se puede deshacer.`}
                    confirmText="Eliminar"
                    cancelText="Cancelar"
                    variant="destructive"
                />
            </div>
        </AppLayout>
    );
}
