import type { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
    MoreVertical, 
    Edit, 
    Trash2, 
    User as UserIcon,
    Calendar,
    Mail,
    CheckCircle,
    Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface UsersTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
}

export function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {
    const getStatusBadge = (user: User) => {
        if (user.is_active) {
            return (
                <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Activo
                </Badge>
            );
        }
        return (
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
                <Clock className="h-3 w-3 mr-1" />
                Inactivo
            </Badge>
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return formatDistanceToNow(date, { addSuffix: true, locale: es });
    };

    return (
        <div className="overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-500 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 dark:text-white">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Lista de Usuarios</h2>
                <p className="text-sm text-gray-600 mt-1 dark:text-white">
                    {users.length} {users.length === 1 ? 'usuario' : 'usuarios'} registrados
                </p>
            </div>
            
            {users.length === 0 ? (
                <div className="p-12 text-center">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 dark:bg-gray-700">
                        <UserIcon className="h-12 w-12 text-gray-400 dark:text-white" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-white">No hay usuarios</h3>
                    <p className="text-gray-500 dark:text-white">Comienza agregando tu primer usuario al sistema.</p>
                    <p className="text-gray-500 dark:text-white">Comienza agregando tu primer usuario al sistema.</p>
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50 dark:bg-gray-700">
                            <TableHead className="font-semibold text-gray-900 dark:text-white">Usuario</TableHead>
                            <TableHead className="font-semibold text-gray-900 dark:text-white">Email</TableHead>
                            <TableHead className="font-semibold text-gray-900 dark:text-white">Estado</TableHead>
                            <TableHead className="font-semibold text-gray-900 dark:text-white">Registrado</TableHead>
                            <TableHead className="font-semibold text-gray-900 dark:text-white text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} className="hover:bg-gray-50/50 transition-colors dark:hover:bg-gray-700">
                                <TableCell className="py-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                            <UserIcon className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                                            <p className="text-sm text-gray-500">ID: {user.uid}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex items-center space-x-2">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <span className="text-gray-900 dark:text-white">{user.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    {getStatusBadge(user)}
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex items-center space-x-2 text-gray-600 dark:text-white">
                                        <Calendar className="h-4 w-4" />
                                        <span className="text-sm">{formatDate(user.created_at)}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 dark:bg-gray-800">
                                            <DropdownMenuItem 
                                                onClick={() => onEdit(user)}
                                                className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-50"
                                            >
                                                <Edit className="h-4 w-4 mr-2 text-blue-600" />
                                                <span className="text-blue-600">Editar</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                                onClick={() => onDelete(user)}
                                                className="cursor-pointer hover:bg-red-50 text-red-600 dark:hover:bg-red-50 dark:text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Eliminar
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
