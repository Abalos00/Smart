import React, { useState, useEffect } from 'react';
import {
    Settings,
    Bell,
    BellOff,
    Sun,
    Moon,
    Volume2,
    VolumeX,
    Smartphone,
    Mail,
    Monitor,
    Palette,
    User,
    Shield,
    Database,
    Download,
    Trash2,
    Save,
    RotateCcw,
    Thermometer,
    Droplet,
    Weight,
    Wifi,
    Check,
    AlertCircle,
    Edit3,
    Key
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const SettingsPanel = () => {
    const { isDark, toggleTheme } = useTheme();
    const { user } = useAuth();
    const notificationContext = useNotifications ? useNotifications() : null;

    // Estados para las configuraciones
    const [settings, setSettings] = useState({
        notifications: {
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
        },
        display: {
            theme: isDark ? 'dark' : 'light',
            autoTheme: false,
            animations: true,
            compactMode: false
        },
        data: {
            autoBackup: true,
            retentionDays: 30,
            exportFormat: 'csv'
        }
    });

    const [hasChanges, setHasChanges] = useState(false);
    const [activeSection, setActiveSection] = useState('notifications');
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [notificationPermission, setNotificationPermission] = useState(
        'Notification' in window ? Notification.permission : 'not-supported'
    );
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });

    // Escuchar cambios en los permisos de notificación
    useEffect(() => {
        if ('Notification' in window) {
            const updatePermissionStatus = () => {
                setNotificationPermission(Notification.permission);
            };

            // Verificar permisos cada vez que la ventana reciba el foco
            const handleFocus = () => {
                updatePermissionStatus();
            };

            window.addEventListener('focus', handleFocus);

            return () => {
                window.removeEventListener('focus', handleFocus);
            };
        }
    }, []);

    // Cargar configuraciones desde localStorage
    useEffect(() => {
        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                setSettings(prev => ({ ...prev, ...parsed }));
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        }
    }, []);

    // Actualizar configuración
    const updateSetting = async (section, key, value) => {
        // Si se está activando las notificaciones, solicitar permisos primero
        if (section === 'notifications' && key === 'enabled' && value === true) {
            const hasPermission = await checkAndRequestNotificationPermission();
            if (!hasPermission) {
                showSuccessNotification('Las notificaciones están habilitadas, pero necesitas dar permisos del navegador', 'warning');
            }
        }

        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value
            }
        }));
        setHasChanges(true);
    };

    // Actualizar configuración anidada
    const updateNestedSetting = (section, subsection, key, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [subsection]: {
                    ...prev[section][subsection],
                    [key]: value
                }
            }
        }));
        setHasChanges(true);
    };

    // Guardar configuraciones
    const saveSettings = () => {
        localStorage.setItem('userSettings', JSON.stringify(settings));
        setHasChanges(false);

        // Aplicar tema si cambió
        if (settings.display.theme !== (isDark ? 'dark' : 'light')) {
            toggleTheme();
        }

        // Actualizar configuraciones de notificaciones en el contexto
        if (notificationContext) {
            notificationContext.updateSettings(settings.notifications);
        }

        // Mostrar notificación de éxito
        showSuccessNotification('Configuraciones guardadas correctamente');
    };

    // Mostrar notificación de éxito
    const showSuccessNotification = (message, type = 'success') => {
        const notification = document.createElement('div');

        let bgColor, iconSvg;
        switch (type) {
            case 'success':
                bgColor = 'bg-gradient-to-r from-green-500 to-green-600';
                iconSvg = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>';
                break;
            case 'warning':
                bgColor = 'bg-gradient-to-r from-yellow-500 to-yellow-600';
                iconSvg = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z"></path>';
                break;
            case 'error':
                bgColor = 'bg-gradient-to-r from-red-500 to-red-600';
                iconSvg = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
                break;
            default:
                bgColor = 'bg-gradient-to-r from-green-500 to-green-600';
                iconSvg = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>';
        }

        notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 max-w-md`;
        notification.innerHTML = `
      <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        ${iconSvg}
      </svg>
      <span class="text-sm">${message}</span>
    `;
        document.body.appendChild(notification);
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 5000); // Aumentar duración para warnings y errores
    };

    // Guardar perfil
    const saveProfile = () => {
        // En una aplicación real, esto sería una llamada a la API
        console.log('Guardando perfil:', profileData);
        setIsEditingProfile(false);
        showSuccessNotification('Perfil actualizado correctamente');
    };

    // Exportar datos
    const exportData = () => {
        const dataToExport = {
            exportDate: new Date().toISOString(),
            user: user,
            settings: settings,
            format: settings.data.exportFormat
        };

        const dataStr = settings.data.exportFormat === 'json'
            ? JSON.stringify(dataToExport, null, 2)
            : 'Usuario,Email,Fecha de Exportación\n' +
            `${user?.name},${user?.email},${new Date().toLocaleDateString()}`;

        const dataBlob = new Blob([dataStr], { type: 'text/plain' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `smartbee-data.${settings.data.exportFormat === 'json' ? 'json' : 'csv'}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showSuccessNotification('Datos exportados correctamente');
    };

    // Verificar y solicitar permisos de notificación
    const checkAndRequestNotificationPermission = async () => {
        if (!('Notification' in window)) {
            showSuccessNotification('Tu navegador no soporta notificaciones', 'error');
            return false;
        }

        // Actualizar estado actual
        setNotificationPermission(Notification.permission);

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission === 'denied') {
            showSuccessNotification('Los permisos de notificación están bloqueados. Habilítalos manualmente en la configuración del navegador', 'warning');
            return false;
        }

        try {
            const permission = await Notification.requestPermission();
            setNotificationPermission(permission); // Actualizar estado

            if (permission === 'granted') {
                showSuccessNotification('¡Permisos de notificación concedidos correctamente!');
                return true;
            } else {
                showSuccessNotification('Permisos de notificación denegados', 'warning');
                return false;
            }
        } catch (error) {
            showSuccessNotification('Error al solicitar permisos de notificación', 'error');
            return false;
        }
    };

    // Solicitar permisos de notificación (función separada para el botón)
    const requestNotificationPermission = async () => {
        await checkAndRequestNotificationPermission();
    };

    // Obtener estado actual de permisos
    const getNotificationPermissionStatus = () => {
        return notificationPermission;
    };

    // Resetear configuraciones
    const resetSettings = () => {
        const defaultSettings = {
            notifications: {
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
            },
            display: {
                theme: 'light',
                autoTheme: false,
                animations: true,
                compactMode: false
            },
            data: {
                autoBackup: true,
                retentionDays: 30,
                exportFormat: 'csv'
            }
        };
        setSettings(defaultSettings);
        setHasChanges(true);
    };

    // Componente Toggle Switch
    const ToggleSwitch = ({ enabled, onChange, size = 'md' }) => {
        const sizeClasses = {
            sm: 'w-8 h-4',
            md: 'w-11 h-6',
            lg: 'w-14 h-7'
        };

        const knobSizes = {
            sm: 'w-3 h-3',
            md: 'w-5 h-5',
            lg: 'w-6 h-6'
        };

        return (
            <button
                onClick={() => onChange(!enabled)}
                className={`${sizeClasses[size]} relative inline-flex items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:focus:ring-emerald-500 ${enabled
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 dark:from-emerald-500 dark:to-emerald-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
            >
                <span
                    className={`${knobSizes[size]} bg-white rounded-full shadow-lg transform transition-transform duration-200 ${enabled ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                />
            </button>
        );
    };

    // Componente Section Header
    const SectionHeader = ({ icon: Icon, title, description }) => (
        <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 dark:from-emerald-500 dark:to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
            </div>
        </div>
    );

    // Componente Setting Item
    const SettingItem = ({ icon: Icon, label, description, children, divider = true }) => (
        <div className={`py-4 ${divider ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                    {Icon && <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />}
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                        {description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
                        )}
                    </div>
                </div>
                <div className="flex-shrink-0">
                    {children}
                </div>
            </div>
        </div>
    );

    const sections = [
        { id: 'notifications', label: 'Notificaciones', icon: Bell },
        { id: 'display', label: 'Pantalla', icon: Monitor },
        { id: 'data', label: 'Datos', icon: Database },
        // { id: 'account', label: 'Cuenta', icon: User }
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 min-h-[600px]">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 dark:from-emerald-500 dark:to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Settings className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Configuraciones</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Personaliza tu experiencia SmartBee</p>
                        </div>
                    </div>

                    {hasChanges && (
                        <div className="flex space-x-2">
                            <button
                                onClick={resetSettings}
                                className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                            <button
                                onClick={saveSettings}
                                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-yellow-500 to-yellow-600 dark:from-emerald-500 dark:to-emerald-600 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                            >
                                <Save className="w-4 h-4" />
                                <span>Guardar</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row">
                {/* Sidebar de navegación */}
                <div className="lg:w-64 p-4 lg:p-6 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700">
                    <nav className="space-y-2">
                        {sections.map((section) => {
                            const Icon = section.icon;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeSection === section.id
                                            ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-emerald-900/30 dark:to-emerald-800/30 text-yellow-700 dark:text-emerald-300 border border-yellow-200 dark:border-emerald-700'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="text-sm font-medium">{section.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Contenido principal */}
                <div className="flex-1 p-4 lg:p-6">
                    {activeSection === 'notifications' && (
                        <div>
                            <SectionHeader
                                icon={Bell}
                                title="Notificaciones"
                                description="Configura cómo y cuándo recibir alertas"
                            />

                            <div className="space-y-6">
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                                    <SettingItem
                                        icon={settings.notifications.enabled ? Bell : BellOff}
                                        label="Activar notificaciones"
                                        description="Habilitar todas las notificaciones del sistema"
                                    >
                                        <ToggleSwitch
                                            enabled={settings.notifications.enabled}
                                            onChange={(value) => updateSetting('notifications', 'enabled', value)}
                                        />
                                    </SettingItem>

                                    {/* Alerta de permisos */}
                                    {settings.notifications.enabled && settings.notifications.push && getNotificationPermissionStatus() !== 'granted' && (
                                        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                            <div className="flex items-start space-x-3">
                                                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                                                <div className="flex-1">
                                                    <h5 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                                        Permisos de notificación requeridos
                                                    </h5>
                                                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                                                        Para recibir notificaciones push, necesitas permitir las notificaciones en tu navegador.
                                                    </p>
                                                    <button
                                                        onClick={requestNotificationPermission}
                                                        className="mt-2 px-3 py-1 text-xs font-medium text-yellow-800 dark:text-yellow-200 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
                                                    >
                                                        Habilitar permisos
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {settings.notifications.enabled && (
                                        <>
                                            <SettingItem
                                                icon={settings.notifications.sound ? Volume2 : VolumeX}
                                                label="Sonidos"
                                                description="Reproducir sonidos para las notificaciones"
                                            >
                                                <ToggleSwitch
                                                    enabled={settings.notifications.sound}
                                                    onChange={(value) => updateSetting('notifications', 'sound', value)}
                                                />
                                            </SettingItem>

                                            <SettingItem
                                                icon={Mail}
                                                label="Notificaciones por email"
                                                description="Enviar alertas importantes por correo electrónico"
                                            >
                                                <ToggleSwitch
                                                    enabled={settings.notifications.email}
                                                    onChange={(value) => updateSetting('notifications', 'email', value)}
                                                />
                                            </SettingItem>

                                            <SettingItem
                                                icon={Smartphone}
                                                label="Notificaciones push"
                                                description={`Mostrar notificaciones en el navegador${getNotificationPermissionStatus() === 'denied'
                                                        ? ' (Permisos bloqueados)'
                                                        : getNotificationPermissionStatus() === 'default'
                                                            ? ' (Permisos pendientes)'
                                                            : getNotificationPermissionStatus() === 'granted'
                                                                ? ' (Permisos concedidos)'
                                                                : ' (No soportado)'
                                                    }`}
                                                divider={false}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <ToggleSwitch
                                                        enabled={settings.notifications.push && getNotificationPermissionStatus() === 'granted'}
                                                        onChange={async (value) => {
                                                            if (value) {
                                                                const hasPermission = await checkAndRequestNotificationPermission();
                                                                if (hasPermission) {
                                                                    updateSetting('notifications', 'push', value);
                                                                }
                                                            } else {
                                                                updateSetting('notifications', 'push', value);
                                                            }
                                                        }}
                                                    />
                                                    {getNotificationPermissionStatus() !== 'granted' && settings.notifications.push && (
                                                        <button
                                                            onClick={requestNotificationPermission}
                                                            className="px-2 py-1 text-xs font-medium text-yellow-600 dark:text-emerald-400 bg-yellow-50 dark:bg-emerald-900/20 border border-yellow-200 dark:border-emerald-700 rounded hover:bg-yellow-100 dark:hover:bg-emerald-900/30 transition-colors"
                                                        >
                                                            Activar
                                                        </button>
                                                    )}
                                                </div>
                                            </SettingItem>
                                        </>
                                    )}
                                </div>

                                {settings.notifications.enabled && (
                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Tipos de alertas</h4>

                                        <SettingItem
                                            icon={Thermometer}
                                            label="Alertas de temperatura"
                                            description="Notificar cuando la temperatura esté fuera del rango normal"
                                        >
                                            <ToggleSwitch
                                                enabled={settings.notifications.alerts.temperature}
                                                onChange={(value) => updateNestedSetting('notifications', 'alerts', 'temperature', value)}
                                            />
                                        </SettingItem>

                                        <SettingItem
                                            icon={Droplet}
                                            label="Alertas de humedad"
                                            description="Notificar cambios críticos en la humedad"
                                        >
                                            <ToggleSwitch
                                                enabled={settings.notifications.alerts.humidity}
                                                onChange={(value) => updateNestedSetting('notifications', 'alerts', 'humidity', value)}
                                            />
                                        </SettingItem>

                                        <SettingItem
                                            icon={Weight}
                                            label="Alertas de peso"
                                            description="Notificar cambios significativos en el peso de la colmena"
                                        >
                                            <ToggleSwitch
                                                enabled={settings.notifications.alerts.weight}
                                                onChange={(value) => updateNestedSetting('notifications', 'alerts', 'weight', value)}
                                            />
                                        </SettingItem>

                                        <SettingItem
                                            icon={Wifi}
                                            label="Alertas de conectividad"
                                            description="Notificar cuando un nodo pierda conexión"
                                            divider={false}
                                        >
                                            <ToggleSwitch
                                                enabled={settings.notifications.alerts.connectivity}
                                                onChange={(value) => updateNestedSetting('notifications', 'alerts', 'connectivity', value)}
                                            />
                                        </SettingItem>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeSection === 'display' && (
                        <div>
                            <SectionHeader
                                icon={Palette}
                                title="Pantalla y tema"
                                description="Personaliza la apariencia de la aplicación"
                            />

                            <div className="space-y-6">
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                                    <SettingItem
                                        icon={isDark ? Moon : Sun}
                                        label="Tema"
                                        description="Selecciona el tema de la aplicación"
                                    >
                                        <select
                                            value={settings.display.theme}
                                            onChange={(e) => updateSetting('display', 'theme', e.target.value)}
                                            className="px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 dark:focus:ring-emerald-500"
                                        >
                                            <option value="light">Claro</option>
                                            <option value="dark">Oscuro</option>
                                            <option value="auto">Automático</option>
                                        </select>
                                    </SettingItem>

                                    <SettingItem
                                        icon={Monitor}
                                        label="Modo compacto"
                                        description="Reduce el espaciado para mostrar más información"
                                    >
                                        <ToggleSwitch
                                            enabled={settings.display.compactMode}
                                            onChange={(value) => updateSetting('display', 'compactMode', value)}
                                        />
                                    </SettingItem>

                                    <SettingItem
                                        icon={Palette}
                                        label="Animaciones"
                                        description="Habilitar animaciones y transiciones suaves"
                                        divider={false}
                                    >
                                        <ToggleSwitch
                                            enabled={settings.display.animations}
                                            onChange={(value) => updateSetting('display', 'animations', value)}
                                        />
                                    </SettingItem>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'data' && (
                        <div>
                            <SectionHeader
                                icon={Database}
                                title="Gestión de datos"
                                description="Configura el manejo y almacenamiento de datos"
                            />

                            <div className="space-y-6">
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                                    <SettingItem
                                        icon={Database}
                                        label="Backup automático"
                                        description="Realizar copias de seguridad automáticas de los datos"
                                    >
                                        <ToggleSwitch
                                            enabled={settings.data.autoBackup}
                                            onChange={(value) => updateSetting('data', 'autoBackup', value)}
                                        />
                                    </SettingItem>

                                    {/* <SettingItem
                                        label="Retención de datos"
                                        description="Días para mantener los datos históricos"
                                    >
                                        <select
                                            value={settings.data.retentionDays}
                                            onChange={(e) => updateSetting('data', 'retentionDays', parseInt(e.target.value))}
                                            className="px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 dark:focus:ring-emerald-500"
                                        >
                                            <option value={7}>7 días</option>
                                            <option value={30}>30 días</option>
                                            <option value={90}>90 días</option>
                                            <option value={365}>1 año</option>
                                        </select>
                                    </SettingItem> */}

                                    <SettingItem
                                        icon={Download}
                                        label="Formato de exportación"
                                        description="Formato predeterminado para exportar datos"
                                        divider={false}
                                    >
                                        <select
                                            value={settings.data.exportFormat}
                                            onChange={(e) => updateSetting('data', 'exportFormat', e.target.value)}
                                            className="px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 dark:focus:ring-emerald-500"
                                        >
                                            <option value="csv">CSV</option>
                                            <option value="json">JSON</option>
                                            <option value="excel">Excel</option>
                                        </select>
                                    </SettingItem>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'account' && (
                        <div>
                            <SectionHeader
                                icon={User}
                                title="Información de cuenta"
                                description="Gestiona tu perfil y configuraciones de seguridad"
                            />

                            <div className="space-y-6">
                                {/* Información del perfil */}
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Información personal</h4>
                                        <button
                                            onClick={() => setIsEditingProfile(!isEditingProfile)}
                                            className="px-3 py-1 text-sm font-medium text-yellow-600 dark:text-emerald-400 bg-yellow-50 dark:bg-emerald-900/20 border border-yellow-200 dark:border-emerald-700 rounded-lg hover:bg-yellow-100 dark:hover:bg-emerald-900/30 transition-colors flex items-center space-x-1"
                                        >
                                            <Edit3 className="w-3 h-3" />
                                            <span>{isEditingProfile ? 'Cancelar' : 'Editar'}</span>
                                        </button>
                                    </div>

                                    {isEditingProfile ? (
                                        <div className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Nombre completo
                                                </label>
                                                <input
                                                    type="text"
                                                    value={profileData.name}
                                                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                                                    className="w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 dark:focus:ring-emerald-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Correo electrónico
                                                </label>
                                                <input
                                                    type="email"
                                                    value={profileData.email}
                                                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                                                    className="w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 dark:focus:ring-emerald-500"
                                                />
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={saveProfile}
                                                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-yellow-500 to-yellow-600 dark:from-emerald-500 dark:to-emerald-600 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                                                >
                                                    <Check className="w-4 h-4" />
                                                    <span>Guardar</span>
                                                </button>
                                                <button
                                                    onClick={() => setIsEditingProfile(false)}
                                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Usuario')}&background=10b981&color=fff&size=80&font-size=0.6`}
                                                alt={user?.name}
                                                className="w-16 h-16 rounded-full ring-4 ring-yellow-500 dark:ring-emerald-500"
                                            />
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{user?.name}</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
                                                <span className="inline-block mt-2 px-3 py-1 bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-emerald-800 dark:to-emerald-700 text-yellow-800 dark:text-emerald-200 rounded-full text-xs font-medium">
                                                    {user?.role}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Configuraciones de cuenta */}
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Configuraciones de cuenta</h4>

                                    <SettingItem
                                        icon={Key}
                                        label="Cambiar contraseña"
                                        description="Actualiza tu contraseña de acceso"
                                    >
                                        <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            Cambiar
                                        </button>
                                    </SettingItem>

                                    <SettingItem
                                        icon={Shield}
                                        label="Autenticación de dos factores"
                                        description="Añade una capa extra de seguridad a tu cuenta"
                                    >
                                        <ToggleSwitch
                                            enabled={false}
                                            onChange={() => showSuccessNotification('Función disponible próximamente')}
                                        />
                                    </SettingItem>

                                    <SettingItem
                                        icon={Bell}
                                        label="Permisos de notificación"
                                        description="Gestionar permisos del navegador"
                                    >
                                        <button
                                            onClick={requestNotificationPermission}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            Solicitar
                                        </button>
                                    </SettingItem>
                                </div>

                                {/* Exportación de datos */}
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Exportación de datos</h4>

                                    <SettingItem
                                        icon={Download}
                                        label="Descargar mis datos"
                                        description="Exporta una copia de tu información personal y configuraciones"
                                    >
                                        <button
                                            onClick={exportData}
                                            className="px-4 py-2 text-sm font-medium text-yellow-700 dark:text-emerald-300 bg-yellow-50 dark:bg-emerald-900/20 border border-yellow-200 dark:border-emerald-700 rounded-lg hover:bg-yellow-100 dark:hover:bg-emerald-900/30 transition-colors flex items-center space-x-2"
                                        >
                                            <Download className="w-4 h-4" />
                                            <span>Exportar</span>
                                        </button>
                                    </SettingItem>
                                </div>

                                {/* Zona de peligro */}
                                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
                                    <h4 className="text-sm font-medium text-red-900 dark:text-red-300 mb-4 flex items-center space-x-2">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>Zona de peligro</span>
                                    </h4>

                                    <SettingItem
                                        icon={Trash2}
                                        label="Eliminar cuenta"
                                        description="Eliminar permanentemente tu cuenta y todos los datos asociados"
                                        divider={false}
                                    >
                                        <button className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                                            Eliminar
                                        </button>
                                    </SettingItem>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;
