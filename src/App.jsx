import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import BeeLogo from './components/UI/BeeLogo';
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <BeeLogo className="w-16 h-16 text-yellow-600 dark:text-emerald-500 animate-pulse" />
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 dark:from-emerald-500 dark:to-emerald-600 rounded-2xl flex items-center justify-center mb-6 mx-auto animate-pulse shadow-2xl">
            <BeeLogo className="w-12 h-12 text-white" />
          </div>
          <p className="text-gray-600">Cargando...</p>
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
    <div className="min-h-screen h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200 flex flex-col">
      <Header setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="min-h-full p-4 sm:p-6 lg:p-4">
            <div className="w-full min-h-[calc(100vh-8rem)] flex flex-col">
            {renderContent()}
            </div>
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