import React, { useState, useEffect } from 'react';
import { Check, X, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const Toast = ({ type = 'success', message, duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Esperar a que termine la animación
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getToastStyles = () => {
        const baseStyles = "fixed top-4 right-4 max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 pointer-events-auto z-50 transition-all duration-300 transform";

        if (!isVisible) {
            return `${baseStyles} translate-x-full opacity-0`;
        }

        return `${baseStyles} translate-x-0 opacity-100`;
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <Check className="w-5 h-5 text-green-500" />;
            case 'error':
                return <X className="w-5 h-5 text-red-500" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            case 'info':
                return <Info className="w-5 h-5 text-blue-500" />;
            default:
                return <Check className="w-5 h-5 text-green-500" />;
        }
    };

    const getBorderColor = () => {
        switch (type) {
            case 'success':
                return 'border-l-4 border-l-green-500';
            case 'error':
                return 'border-l-4 border-l-red-500';
            case 'warning':
                return 'border-l-4 border-l-yellow-500';
            case 'info':
                return 'border-l-4 border-l-blue-500';
            default:
                return 'border-l-4 border-l-green-500';
        }
    };

    return (
        <div className={`${getToastStyles()} ${getBorderColor()}`}>
            <div className="flex items-center p-4">
                <div className="flex-shrink-0">
                    {getIcon()}
                </div>
                <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {message}
                    </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                    <button
                        onClick={() => {
                            setIsVisible(false);
                            setTimeout(onClose, 300);
                        }}
                        className="inline-flex text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Hook para gestionar toasts
export const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'success', duration = 3000) => {
        const id = Date.now();
        const newToast = { id, message, type, duration };

        setToasts(prev => [...prev, newToast]);

        return id;
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const ToastContainer = () => (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    type={toast.type}
                    message={toast.message}
                    duration={toast.duration}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );

    return {
        addToast,
        removeToast,
        ToastContainer
    };
};

export default Toast;
