import React from 'react';
import { LogOut, User, Bell, Sun, Moon, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import BeeLogo from '../UI/BeeLogo';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  // Intentar usar el contexto de notificaciones si está disponible
  let unreadCount = 0;
  try {
    const { useNotifications } = require('../../context/NotificationContext');
    const notificationContext = useNotifications();
    unreadCount = notificationContext ? notificationContext.getUnreadCount() : 0;
  } catch (error) {
    // El contexto no está disponible
  }

  // Generar avatar basado en el nombre del usuario
  const getAvatarUrl = (name) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b981&color=fff&size=40&font-size=0.6`;
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {/* Botón menú móvil */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 dark:from-emerald-500 dark:to-emerald-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                <BeeLogo className="w-6 h-6 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
                SmartBee
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Toggle tema */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button className="p-2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white relative transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 ? (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-red-600 rounded-full text-white text-xs font-bold flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              ) : (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-pulse"></span>
              )}
            </button>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-3">
                <img
                  src={getAvatarUrl(user?.name || 'Usuario')}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full ring-2 ring-yellow-500 dark:ring-emerald-500"
                />
                <div className="hidden sm:block">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {user?.name}
                  </span>
                  <span className="block text-xs px-2 py-1 bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-emerald-800 dark:to-emerald-700 text-yellow-800 dark:text-emerald-200 rounded-full">
                    {user?.role}
                  </span>
                </div>
              </div>

              <button
                onClick={logout}
                className="p-2 text-gray-400 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Cerrar sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;