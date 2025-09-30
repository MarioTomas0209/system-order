import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Modal,
    ModalContent,
    ModalDescription,
    ModalFooter,
    ModalHeader,
    ModalTitle,
} from '@/components/ui/modal';
import branchRoutes from '@/routes/branches';
import { type Branch } from '@/types';
import { router } from '@inertiajs/react';
import { Building2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BranchModalProps {
    isOpen: boolean;
    onClose: () => void;
    branch?: Branch | null;
    mode: 'create' | 'edit';
}

export default function BranchModal({ isOpen, onClose, branch, mode }: BranchModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        is_active: true,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset form when modal opens/closes or branch changes
    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && branch) {
                setFormData({
                    name: branch.name,
                    address: branch.address || '',
                    phone: branch.phone || '',
                    is_active: branch.is_active,
                });
            } else {
                setFormData({
                    name: '',
                    address: '',
                    phone: '',
                    is_active: true,
                });
            }
            setErrors({});
        }
    }, [isOpen, mode, branch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            if (mode === 'create') {
                await router.post(branchRoutes.store().url, formData, {
                    onSuccess: () => {
                        onClose();
                    },
                    onError: (errors) => {
                        setErrors(errors);
                    },
                });
            } else if (mode === 'edit' && branch) {
                await router.put(branchRoutes.update({ branch: branch.id }).url, formData, {
                    onSuccess: () => {
                        onClose();
                    },
                    onError: (errors) => {
                        setErrors(errors);
                    },
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <Modal open={isOpen} onOpenChange={onClose}>
            <ModalContent className="sm:max-w-[425px]">
                <ModalHeader>
                    <ModalTitle className="flex items-center space-x-2">
                        <Building2 className="h-5 w-5" />
                        <span>
                            {mode === 'create' ? 'Crear Sucursal' : 'Editar Sucursal'}
                        </span>
                    </ModalTitle>
                    <ModalDescription>
                        {mode === 'create' 
                            ? 'Agrega una nueva sucursal a tu empresa'
                            : 'Modifica la información de la sucursal'
                        }
                    </ModalDescription>
                </ModalHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nombre */}
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Nombre de la Sucursal *
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                handleInputChange('name', e.target.value)
                            }
                            placeholder="Ej: Sucursal Centro"
                            className={errors.name ? 'border-red-500' : ''}
                            required
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name}</p>
                        )}
                    </div>

                    {/* Dirección */}
                    <div className="space-y-2">
                        <Label htmlFor="address">
                            Dirección
                        </Label>
                        <Textarea
                            id="address"
                            value={formData.address}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                                handleInputChange('address', e.target.value)
                            }
                            placeholder="Ej: Av. Principal 123, Centro, Ciudad"
                            rows={3}
                            className={errors.address ? 'border-red-500' : ''}
                        />
                        {errors.address && (
                            <p className="text-sm text-red-500">{errors.address}</p>
                        )}
                    </div>

                    {/* Teléfono */}
                    <div className="space-y-2">
                        <Label htmlFor="phone">
                            Teléfono
                        </Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                handleInputChange('phone', e.target.value)
                            }
                            placeholder="Ej: (999) 123-4567"
                            className={errors.phone ? 'border-red-500' : ''}
                        />
                        {errors.phone && (
                            <p className="text-sm text-red-500">{errors.phone}</p>
                        )}
                    </div>

                    {/* Estado Activo */}
                    <div className="space-y-2">
                        <Label htmlFor="is_active">
                            Estado de la Sucursal
                        </Label>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="is_active"
                                checked={formData.is_active}
                                onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                            />
                            <Label htmlFor="is_active" className="text-sm font-normal">
                                {formData.is_active ? 'Sucursal Activa' : 'Sucursal Inactiva'}
                            </Label>
                        </div>
                        {errors.is_active && (
                            <p className="text-sm text-red-500">{errors.is_active}</p>
                        )}
                    </div>

                    <ModalFooter>
                        <Button variant="destructive" type="button" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button variant="blueGradient" type="submit" disabled={isSubmitting}>
                            {isSubmitting 
                                ? (mode === 'create' ? 'Creando...' : 'Guardando...') 
                                : (mode === 'create' ? 'Crear Sucursal' : 'Guardar Cambios')
                            }
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}
