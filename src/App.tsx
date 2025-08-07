import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './components/Auth/Login';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import ApicultorDashboard from './components/Dashboard/ApicultorDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import UserManagement from './components/Admin/UserManagement';
import NodeManagement from './components/Admin/NodeManagement';
import AlertsPanel from './components/Dashboard/AlertsPanel';

const AppContent = () => {
  const { isAuthenticated, loading, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 mx-auto animate-pulse shadow-lg">
            <span className="text-white text-2xl">🍯</span>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return isAdmin ? <AdminDashboard /> : <ApicultorDashboard />;
      case 'users':
        return isAdmin ? <UserManagement /> : null;
      case 'nodes':
        return isAdmin ? <NodeManagement /> : null;
      case 'alerts':
        return <AlertsPanel />;
      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Configuración</h2>
            <p className="text-gray-600">Panel de configuración en desarrollo...</p>
          </div>
        );
      default:
        return isAdmin ? <AdminDashboard /> : <ApicultorDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />
        <main className="flex-1 p-4 lg:p-8 lg:ml-64">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;