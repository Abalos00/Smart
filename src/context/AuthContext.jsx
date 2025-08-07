import React, { createContext, useContext, useState, useEffect } from 'react';
import { USER_ROLES } from '../types';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular verificación de sesión existente
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulación de login - en producción esto se conectará al backend
    const mockUsers = [
      { id: 1, email: 'admin@apicultor.com', password: 'admin123', role: USER_ROLES.ADMIN, name: 'Administrador' },
      { id: 2, email: 'apicultor@test.com', password: 'api123', role: USER_ROLES.APICULTOR, name: 'Juan Pérez' },
      { id: 3, email: 'maria@apicultor.com', password: 'maria123', role: USER_ROLES.APICULTOR, name: 'María García' },
      { id: 4, email: 'carlos@apicultor.com', password: 'carlos123', role: USER_ROLES.APICULTOR, name: 'Carlos López' },
      { id: 5, email: 'ana@apicultor.com', password: 'ana123', role: USER_ROLES.APICULTOR, name: 'Ana Martínez' }
    ];

    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userSession = { ...foundUser };
      delete userSession.password;
      setUser(userSession);
      localStorage.setItem('user', JSON.stringify(userSession));
      return { success: true };
    }
    
    return { success: false, error: 'Credenciales inválidas' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === USER_ROLES.ADMIN
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};