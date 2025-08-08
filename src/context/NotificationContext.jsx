import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [settings, setSettings] = useState({
        enabled: true,
        sound: true,
        email: true,
        push: true,
        alerts: {
            temperature: true,
            humidity: true,
            weight: true,
            connectivity: true
        }
    });

    // Cargar configuraciones desde localStorage
    useEffect(() => {
        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                if (parsed.notifications) {
                    setSettings(parsed.notifications);
                }
            } catch (error) {
                console.error('Error loading notification settings:', error);
            }
        }
    }, []);

    // Solicitar permisos de notificación
    useEffect(() => {
        if (settings.enabled && settings.push && 'Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission();
            }
        }
    }, [settings.enabled, settings.push]);

    // Función para agregar notificación
    const addNotification = useCallback((notification) => {
        if (!settings.enabled) return;

        const id = Date.now().toString();
        const newNotification = {
            id,
            timestamp: new Date(),
            read: false,
            ...notification
        };

        setNotifications(prev => [newNotification, ...prev].slice(0, 50)); 

        // Reproducir sonido si está habilitado
        if (settings.sound) {
            try {
                const audio = new Audio('/notification-sound.mp3'); 
                audio.volume = 0.3;
                audio.play().catch(() => { }); 
            } catch (error) {
                console.log('No se pudo reproducir el sonido de notificación');
            }
        }

        // Mostrar notificación del navegador
        if (settings.push && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(notification.title, {
                body: notification.message,
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                tag: notification.type
            });
        }

        // Simular envío de email (en una aplicación real esto sería una llamada a la API)
        if (settings.email && notification.priority === 'high') {
            console.log('Enviando notificación por email:', notification);
        }

        return id;
    }, [settings]);

    // Función para marcar como leída
    const markAsRead = useCallback((id) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
    }, []);

    // Función para marcar todas como leídas
    const markAllAsRead = useCallback(() => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, read: true }))
        );
    }, []);

    // Función para eliminar notificación
    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, []);

    // Función para limpiar todas las notificaciones
    const clearAllNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    // Función para simular alertas automáticas (en desarrollo)
    const checkForAlerts = useCallback((sensorData) => {
        if (!settings.enabled) return;

        // Verificar temperatura
        if (settings.alerts.temperature && sensorData.temperature) {
            if (sensorData.temperature > 35 || sensorData.temperature < 15) {
                addNotification({
                    type: 'alert',
                    category: 'temperature',
                    title: 'Alerta de Temperatura',
                    message: `Temperatura fuera del rango normal: ${sensorData.temperature}°C`,
                    priority: 'high',
                    nodeId: sensorData.nodeId,
                    nodeName: sensorData.nodeName
                });
            }
        }

        // Verificar humedad
        if (settings.alerts.humidity && sensorData.humidity) {
            if (sensorData.humidity > 80 || sensorData.humidity < 40) {
                addNotification({
                    type: 'alert',
                    category: 'humidity',
                    title: 'Alerta de Humedad',
                    message: `Humedad fuera del rango normal: ${sensorData.humidity}%`,
                    priority: 'medium',
                    nodeId: sensorData.nodeId,
                    nodeName: sensorData.nodeName
                });
            }
        }

        // Verificar peso (solo para colmenas)
        if (settings.alerts.weight && sensorData.weight && sensorData.type === 'colmena') {
            // Ejemplo: detectar pérdida rápida de peso
            const previousWeight = sensorData.previousWeight || sensorData.weight;
            const weightLoss = previousWeight - sensorData.weight;

            if (weightLoss > 2) { // Pérdida de más de 2kg
                addNotification({
                    type: 'alert',
                    category: 'weight',
                    title: 'Alerta de Peso',
                    message: `Pérdida significativa de peso detectada: -${weightLoss.toFixed(1)}kg`,
                    priority: 'high',
                    nodeId: sensorData.nodeId,
                    nodeName: sensorData.nodeName
                });
            }
        }
    }, [settings, addNotification]);

    // Funciones de utilidad
    const getUnreadCount = useCallback(() => {
        return notifications.filter(notif => !notif.read).length;
    }, [notifications]);

    const getNotificationsByType = useCallback((type) => {
        return notifications.filter(notif => notif.type === type);
    }, [notifications]);

    const value = {
        notifications,
        settings,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAllNotifications,
        checkForAlerts,
        getUnreadCount,
        getNotificationsByType,
        updateSettings: setSettings
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationContext;
