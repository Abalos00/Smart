import React from 'react';
import { Home, Users, Activity, AlertTriangle, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import BeeLogo from '../UI/BeeLogo';

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const { isAdmin } = useAuth();
  const { isDark } = useTheme();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, roles: ['admin', 'apicultor'] },
    { id: 'users', label: 'Usuarios', icon: Users, roles: ['admin'] },
    { id: 'nodes', label: 'Nodos', icon: Activity, roles: ['admin'] },
    { id: 'alerts', label: 'Alertas', icon: AlertTriangle, roles: ['admin', 'apicultor'] },
    { id: 'settings', label: 'Configuración', icon: Settings, roles: ['admin', 'apicultor'] }
  ];

  const userRole = isAdmin ? 'admin' : 'apicultor';
  const filteredItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 h-full
        bg-white dark:bg-gray-900 shadow-xl lg:shadow-md 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        border-r border-gray-200 dark:border-gray-700
      `}>
        <div className="h-full bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 flex flex-col">
          {/* Logo en móvil */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 dark:from-emerald-500 dark:to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <BeeLogo className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">SmartBee</h1>
            </div>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-8">
            <div className="px-4 space-y-2">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false); // Cerrar sidebar en móvil
                }}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 dark:from-emerald-500 dark:to-emerald-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-800 dark:hover:to-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 transition-transform duration-200 ${
                  isActive ? 'scale-110' : 'group-hover:scale-105'
                }`} />
                {item.label}
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;