// Configuración de colores para las gráficas
export const CHART_COLORS = [
    '#3b82f6', // blue-500
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
    '#ef4444', // red-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#06b6d4', // cyan-500
    '#84cc16', // lime-500
    '#f97316', // orange-500
    '#6366f1', // indigo-500
];

export const STATUS_COLORS: Record<string, string> = {
    'En Elaboración': '#3b82f6',
    'Entregada': '#10b981',
    'Cancelada': '#ef4444',
    'Pendiente': '#f59e0b',
    'Entregado': '#10b981',
    'Parcial': '#3b82f6',
    'Activos': '#10b981',
    'Inactivos': '#94a3b8',
    'Activas': '#10b981',
    'Inactivas': '#94a3b8',
    'Administradores': '#8b5cf6',
    'Usuarios': '#3b82f6',
    'Efectivo': '#10b981',
    'Tarjeta': '#3b82f6',
    'Transferencia': '#f59e0b',
    'Recolección': '#3b82f6',
    'Envío': '#f59e0b',
    'Entrega Directa': '#10b981',
};

export const getColorForIndex = (index: number): string => {
    return CHART_COLORS[index % CHART_COLORS.length];
};

export const getColorForName = (name: string): string => {
    return STATUS_COLORS[name] || getColorForIndex(0);
};

