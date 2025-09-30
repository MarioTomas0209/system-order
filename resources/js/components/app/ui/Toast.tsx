import React from 'react';
import { toast } from 'sonner';

type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
type ToastAction = {
    label: string;
    onClick: () => void;
}

interface ToastOptions {
    position?: ToastPosition;
    duration?: number;
    description?: string;
    action?: ToastAction;
}

class ToastService {
    private getBaseClassName(type: string): string {
        const baseClasses = "!shadow-md dark:!shadow-xl !rounded-lg !p-4 !font-medium !border";

        switch (type) {
            case 'success':
                return `${baseClasses} !bg-primary dark:!bg-green-700 !text-white !border-primary dark:!border-green-600`;
            case 'error':
                return `${baseClasses} !bg-red-600 dark:!bg-red-800 !text-white !border-red-500 dark:!border-red-700`;
            case 'warning':
                return `${baseClasses} !bg-yellow-600 dark:!bg-yellow-700 !text-white !border-yellow-500 dark:!border-yellow-600`;
            case 'info':
                return `${baseClasses} !bg-blue-600 dark:!bg-blue-800 !text-white !border-blue-500 dark:!border-blue-700`;
            default:
                return `${baseClasses} !bg-[#14314F] dark:!bg-slate-800 !text-white !border-[#14314F] dark:!border-slate-700`;
        }
    }

    private getDescriptionClassName(): string {
        return "!text-white/90 dark:!text-white/80 !text-sm";
    }

    private getCloseButtonStyle(): React.CSSProperties {
        return {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '4px',
            padding: '4px 12px',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'opacity 0.2s',
            cursor: 'pointer'
        };
    }

    private showToast(
        type: 'success' | 'error' | 'warning' | 'info',
        message: string,
        description?: string,
        position: ToastPosition = 'bottom-right',
        duration: number = 5000,
        action?: ToastAction
    ) {

        if (!action && type === 'error') {
            action = {
                label: 'Cerrar',
                onClick: () => { },
            }
        }


        const className = this.getBaseClassName(type);
        const descriptionClassName = this.getDescriptionClassName();
        const actionButtonStyle = this.getCloseButtonStyle();

        const options = {
            description,
            duration,
            position,
            className,
            descriptionClassName,
            action,
            actionButtonStyle,
        };

        switch (type) {
            case 'success':
                toast.success(message, options);
                break;
            case 'error':
                toast.error(message, options);
                break;
            case 'warning':
                toast.warning(message, options);
                break;
            case 'info':
                toast.info(message, options);
                break;
        }
    }

    success(message: string, description?: string, position?: ToastPosition, duration?: number, action?: ToastAction) {
        this.showToast('success', message, description, position, duration, action);
    }

    error(message: string, description?: string, position?: ToastPosition, duration?: number, action?: ToastAction) {
        this.showToast('error', message, description, position, duration, action);
    }

    warning(message: string, description?: string, position?: ToastPosition, duration?: number, action?: ToastAction) {
        this.showToast('warning', message, description, position, duration, action);
    }

    info(message: string, description?: string, position?: ToastPosition, duration?: number, action?: ToastAction) {
        this.showToast('info', message, description, position, duration, action);
    }

    custom(message: string, options: ToastOptions = {}) {
        const { position = 'bottom-right', duration = 5000, description, action } = options;

        toast(message, {
            description,
            duration,
            position,
            className: "!bg-[#14314F] dark:!bg-slate-800 !text-white !shadow-md dark:!shadow-xl !rounded-lg !p-4 !font-medium !border !border-[#14314F] dark:!border-slate-700",
            descriptionClassName: '!text-white/90 dark:!text-white/80 !text-sm',
            action
        });
    }
}


export const Toast = new ToastService();

export const ToastComponent = () => {
    return null;
};