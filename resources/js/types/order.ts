export interface Order {
    id: number;
    order_code: string;
    created_date: string;
    delivery_date?: string;
    concept: string;
    total: number;
    advance: number;
    balance: number;
    status: 'pendiente' | 'pagada_parcial' | 'pagada' | 'entregada' | 'cancelada';
    notes?: string;
    delivery_address?: string;
    contact_phone?: string;
    branch_id: number;
    created_by: number;
    updated_by?: number;
    created_at: string;
    updated_at: string;
    
    // Relaciones
    branch?: Branch;
    payments?: Payment[];
    deliveries?: Delivery[];
    creator?: User;
    updater?: User;
    
    // Atributos calculados
    total_paid?: number;
    remaining_balance?: number;
    status_badge_color?: string;
    status_label?: string;
}

export interface Payment {
    id: number;
    order_id: number;
    payment_date: string;
    amount: number;
    method: 'efectivo' | 'tarjeta' | 'transferencia';
    received_by: number;
    notes?: string;
    created_at: string;
    updated_at: string;
    
    // Relaciones
    receiver?: User;
    
    // Atributos calculados
    method_label?: string;
    method_icon?: string;
}

export interface Delivery {
    id: number;
    order_id: number;
    delivery_date: string;
    status: 'pendiente' | 'entregado' | 'parcial';
    comments?: string;
    delivered_by: number;
    tracking_number?: string;
    delivery_method?: string;
    created_at: string;
    updated_at: string;
    
    // Relaciones
    deliverer?: User;
    
    // Atributos calculados
    status_label?: string;
    status_badge_color?: string;
    delivery_method_label?: string;
}

export interface Branch {
    id: number;
    name: string;
    address?: string;
    phone?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at?: string;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
}

// Interfaces para formularios
export interface NewOrderForm {
    order_code: string;
    elaboration_date: string;
    delivery_date: string;
    branch_id: number;
    concept: string;
    total: number;
    advance: number;
    notes?: string;
    delivery_address?: string;
    contact_phone?: string;
}

export interface PaymentForm {
    payment_date: string;
    amount: number;
    method: 'efectivo' | 'tarjeta' | 'transferencia';
    notes?: string;
}

export interface DeliveryForm {
    delivery_date: string;
    status: 'entregado' | 'parcial';
    comments?: string;
    tracking_number?: string;
    delivery_method?: string;
}

export interface PayAndDeliverForm extends PaymentForm {
    delivery_date: string;
    delivery_comments?: string;
}