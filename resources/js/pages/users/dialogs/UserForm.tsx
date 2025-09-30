import type { User } from '@/types';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Loader2, User as UserIcon, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Toast } from '@/components/app/ui';
import { Checkbox } from '@/components/ui/checkbox';

interface UserFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    user?: User | null;
}

export const UserForm = ({ isOpen, onClose, onSuccess, user }: UserFormProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const isEditing = !!user;

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        name: '',
        email: '',
        is_active: true as boolean,
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        if (user) {
            setData({
                name: user.name,
                email: user.email,
                is_active: user.is_active as boolean,
                password: '',
                password_confirmation: '',
            });
        } else {
            reset();
        }
    }, [user, isOpen, setData, reset]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isEditing) {
            patch(`/users/${user.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    onSuccess();
                    Toast.success('Usuario actualizado correctamente');
                    reset();
                },
                onError: () => {
                    Toast.error('Error al actualizar el usuario');
                },
            });
        } else {
            post('/users', {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    onSuccess();
                    Toast.success('Usuario creado correctamente');
                },
                onError: () => {
                    Toast.error('Error al crear el usuario');
                },
            });
        }
    };

    const handleClose = () => {
        if (!processing) {
            reset();
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-800">
                <DialogHeader>
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                            <UserIcon className="h-5 w-5 text-white" />
                        </div>
                        <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                            {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-gray-600 dark:text-white">
                        {isEditing
                            ? 'Modifica la información del usuario seleccionado.'
                            : 'Completa los datos para crear un nuevo usuario en el sistema.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
                    <div className="space-y-5">
                        {/* Name Field */}
                        <div className="grid space-y-1">
                            <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-white">
                                Nombre completo *
                            </Label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                                    placeholder="Ingresa el nombre completo"
                                    required
                                    autoComplete="off"
                                />
                            </div>
                            {errors.name && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="grid space-y-1">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-white">
                                Correo electrónico *
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                                    placeholder="usuario@ejemplo.com"
                                    required
                                    autoComplete="off"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="grid space-y-1">
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-white">
                                {isEditing ? 'Nueva contraseña' : 'Contraseña *'}
                                {isEditing && <span className="text-gray-500 font-normal"> (dejar vacío para mantener la actual)</span>}
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                                    placeholder={isEditing ? 'Nueva contraseña' : 'Mínimo 8 caracteres'}
                                    required={!isEditing}
                                    minLength={8}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-white"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        {/* Password Confirmation Field */}
                        {!isEditing && (
                            <div className="grid space-y-1">
                                <Label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700 dark:text-white">
                                    Confirmar contraseña *
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password_confirmation"
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                                        placeholder="Confirma la contraseña"
                                        required
                                        autoComplete="new-password"
                                    />
                                </div>
                                {errors.password_confirmation && (
                                    <p className="text-sm text-red-600 dark:text-red-400">{errors.password_confirmation}</p>
                                )}
                            </div>
                        )}

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="is_active"
                                checked={Boolean(data.is_active)}
                                onCheckedChange={(checked) => setData('is_active', checked === true)}
                            />
                            <Label htmlFor="is_active" className="cursor-pointer dark:text-white">Activo</Label>
                        </div>
                    </div>

                    <DialogFooter className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-500">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={processing}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                        >
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEditing ? 'Actualizar' : 'Crear'} Usuario
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
